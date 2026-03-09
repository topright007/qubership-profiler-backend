package com.netcracker.integration.cloud;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.sql.SQLException;
import java.time.Instant;
import java.util.List;
import java.util.Map;

import org.apache.groovy.util.Maps;
import org.apache.hadoop.conf.Configuration;
import org.apache.parquet.example.data.Group;
import org.apache.parquet.example.data.simple.SimpleGroupFactory;
import org.apache.parquet.hadoop.ParquetWriter;
import org.apache.parquet.hadoop.example.ExampleParquetWriter;
import org.apache.parquet.hadoop.util.HadoopOutputFile;
import org.apache.parquet.schema.MessageType;
import org.apache.parquet.schema.MessageTypeParser;
import org.junit.jupiter.api.Test;

import com.netcracker.cdt.ui.rest.v2.dto.Requests;
import com.netcracker.cdt.ui.services.calls.models.CallRecord;
import com.netcracker.cdt.ui.services.calls.tasks.ReloadTaskState;
import com.netcracker.common.PersistenceType;
import com.netcracker.common.models.DurationRange;
import com.netcracker.common.models.TimeRange;
import com.netcracker.common.models.meta.dict.CallParameters;
import com.netcracker.common.models.pod.PodIdRestart;
import com.netcracker.fixtures.cloud.MinioUtils;
import com.netcracker.fixtures.cloud.S3FilesTable;
import com.netcracker.integration.Profiles;
import com.netcracker.persistence.PersistenceService;

import io.quarkus.arc.lookup.LookupIfProperty;
import io.quarkus.logging.Log;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import io.quarkus.test.junit.TestProfile;

import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.api.parallel.Execution;
import static org.junit.jupiter.api.Assertions.*;

import static org.junit.jupiter.api.parallel.ExecutionMode.SAME_THREAD;

@QuarkusTest
@TestProfile(Profiles.CloudTest.class)
@LookupIfProperty(name = "service.persistence", stringValue = PersistenceType.CLOUD)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@Execution(SAME_THREAD)
public class CallRetrieverTest {
        private static final MessageType PARQUET_SCHEMA = MessageTypeParser.parseMessageType("""
                        message call_record {
                          required int64 time;
                          required int32 duration;
                          required int64 nonBlocking;
                          required int64 cpuTime;
                          required int32 queueWaitDuration;
                          required int32 suspendDuration;
                          required int32 calls;
                          required binary namespace (STRING);
                          required binary serviceName (STRING);
                          required binary podName (STRING);
                          required int64 restartTime;
                          required binary method (STRING);
                          required int32 transactions;
                          required int64 memoryUsed;
                          required int64 logsGenerated;
                          required int64 logsWritten;
                          required int64 fileRead;
                          required int64 fileWritten;
                          required int64 netRead;
                          required int64 netWritten;
                          optional group params (MAP) {
                            repeated group key_value {
                              required binary key (STRING);
                              optional group value (LIST) {
                                repeated group list {
                                  required binary element (STRING);
                                }
                              }
                            }
                          }
                        }
                        """);

        @Inject
        PersistenceService persistence;

        @Inject
        MinioUtils minioUtils;

        @Inject
        S3FilesTable s3FilesTable;

        private PodIdRestart getPodByService(String service) {
                return PodIdRestart.getPodInfo("test.namespace-1", service, "test.service-0-8xvrywyhvu-fyf9b", 1729296000000L);
        }

        @Test
        public void sampleTest() throws SQLException {
                String fileDir = "2024/10/20/23/test.namespace-1-90s.parquet";
                String method = "void com.netcracker.cdt.uiservice.UiServiceApplication.main(java.lang.String[]) (UiServiceApplication.java:58) [escui.jar!/BOOT-INF/classes]";
                var callParams = new CallParameters(Maps.of("thread", List.of("main")));

                var expectedCallRecords = List.of(
                        new CallRecord(1729780536553L, 93906, 0, 74993, 0, 44364, 416,
                                getPodByService("test.service-0"),
                                null, method, 102, 0, 0, 0, 643899, 6935, 0, 3327174,
                                callParams),
                        new CallRecord(1729780558943L, 93906, 0, 5735, 0, 6467, 148,
                                getPodByService("test.service-0"),
                                null, method, 252, 0, 0, 0, 643899, 6935, 0, 4158557,
                                callParams),
                        new CallRecord(1729780565333L, 93906, 0, 72412, 0, 33220, 471,
                                getPodByService("test.service-0"),
                                null, method,332, 0, 0, 0, 643899, 6935, 0, 1839667,
                                callParams)
                );

                Path parquetFile = createParquetFixture(method, expectedCallRecords);
                minioUtils.uploadFile(fileDir, parquetFile.toString());
                s3FilesTable.insertRecord(Instant.parse("2024-10-24T14:00:00.00Z"), Instant.parse("2024-10-24T20:00:00.00Z"), "calls", "", "test.namespace-1",
                                90000,
                                "test.namespace-1-90s.parquet", "completed",
                                "[\"test.service-0\"]",
                                Instant.parse("2024-10-24T17:47:32.29Z"),
                                1,
                                78, 58203, fileDir, "test.namespace-1-90s.parquet");

                var services = List.of(new Requests.Service("test.namespace-1", "test.service-0"));
                var range = TimeRange.ofEpochMilli(1729780536552L, 1729780570000L); // 2024-10-24T14:35:36Z - 2024-10-24T14:36:10Z
                var durationRange = DurationRange.ofMillis(0, 93907);

                var taskState = new ReloadTaskState("test", 0);
                taskState = persistence.cloud.getCallSequence(services, "", range, durationRange, taskState);
                taskState.finish();

                Log.info(taskState.getStatus(0).toString());
                assertFalse(taskState.getCallsList().isEmpty());
                assertEquals(expectedCallRecords, taskState.getCallsList().sortCalls(0, true).all());
                try {
                        Files.deleteIfExists(parquetFile);
                } catch (IOException ignored) {
                        // Best effort cleanup for local temporary fixture.
                }
        }

        private static Path createParquetFixture(String method, List<CallRecord> records) {
                try {
                        Path dir = Path.of("target", "test-parquet-fixtures");
                        Files.createDirectories(dir);
                        Path filePath = Files.createTempFile(dir, "call-retriever-", ".parquet");
                        Files.deleteIfExists(filePath);

                        Configuration configuration = new Configuration(false);
                        SimpleGroupFactory groupFactory = new SimpleGroupFactory(PARQUET_SCHEMA);
                        try (ParquetWriter<Group> writer = ExampleParquetWriter
                                        .builder(HadoopOutputFile.fromPath(new org.apache.hadoop.fs.Path(filePath.toUri()),
                                                        configuration))
                                        .withConf(configuration)
                                        .withType(PARQUET_SCHEMA)
                                        .build()) {
                                for (CallRecord record : records) {
                                        Group group = groupFactory.newGroup()
                                                        .append("time", record.time())
                                                        .append("duration", record.duration())
                                                        .append("nonBlocking", record.nonBlocking())
                                                        .append("cpuTime", record.cpuTime())
                                                        .append("queueWaitDuration", record.queueWaitDuration())
                                                        .append("suspendDuration", record.suspendDuration())
                                                        .append("calls", record.calls())
                                                        .append("namespace", record.pod().namespace())
                                                        .append("serviceName", record.pod().service())
                                                        .append("podName", record.pod().podName())
                                                        .append("restartTime", record.pod().restartTime().toEpochMilli())
                                                        .append("method", method)
                                                        .append("transactions", (int) record.transactions())
                                                        .append("memoryUsed", record.memoryUsed())
                                                        .append("logsGenerated", (long) record.logsGenerated())
                                                        .append("logsWritten", (long) record.logsWritten())
                                                        .append("fileRead", record.fileRead())
                                                        .append("fileWritten", record.fileWritten())
                                                        .append("netRead", record.netRead())
                                                        .append("netWritten", record.netWritten());

                                        Group keyValue = group.addGroup("params").addGroup("key_value");
                                        keyValue.append("key", "thread");
                                        keyValue.addGroup("value").addGroup("list").append("element", "main");

                                        writer.write(group);
                                }
                        }
                        return filePath;
                } catch (IOException e) {
                        throw new RuntimeException("Failed to prepare parquet fixture for test", e);
                }
        }
}
