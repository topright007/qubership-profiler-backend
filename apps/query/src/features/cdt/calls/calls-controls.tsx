import { useCallsStore, useCallsStoreSelector } from '@app/features/cdt/calls/calls-store';

import { useSearchParamsApplied } from "@app/store/slices/context-slices";
import useCallsFetchArg from "@app/features/cdt/calls/use-calls-fetch-arg";
import { useGetCallsByConditionQuery } from '@app/store/cdt-openapi';
import { createExportUrl, createCallUrl } from '@app/features/cdt/calls/create-call-url';

import { DownloadOutlined, LinkOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';

const CallsControls = () => {
    const selectedCalls = useCallsStoreSelector(s => s.selectedCalls);
    const openCallsDisabled = !selectedCalls || selectedCalls?.length === 0;
    const searchParamsApplied = useSearchParamsApplied();
    const [callRequest, { shouldSkip, notReady }] = useCallsFetchArg();
    console.log(callRequest.filters.duration);

    const graphCollapsed = useCallsStoreSelector(s => s.graphCollapsed);
    const [, set] = useCallsStore();

    // const [callRequest, { shouldSkip, notReady }] = useCallsFetchArg();
    // const { isFetching, data, isError, error, refetch } = useGetCallsByConditionQuery(callRequest, {
    //     skip: shouldSkip,
    // });
    // const showGraphDisabled = !data?.calls || data.calls.length == 0;

    // console.log("calls");
    // console.log(data?.calls?.length);
    // console.log(showGraphDisabled);

    const handleHideGraph = () => {
        set({ graphCollapsed: !graphCollapsed });
    };

    return (
        <>

            <Tooltip title={!openCallsDisabled ? 'Show calls statistics as graph' : undefined} placement="bottomLeft">
                <Button onClick={handleHideGraph}>
                    {graphCollapsed ? 'Show Graph' : 'Hide Graph'}
                </Button>
            </Tooltip>

            <Tooltip
                title={!openCallsDisabled ? `Download calls as CSV file ${callRequest.filters.duration}` : undefined}
                placement="bottomLeft"
            >
                <Button href={createExportUrl(callRequest)} target="_blank" type="default" icon={<DownloadOutlined />} />
            </Tooltip>

            <Tooltip
                title={!openCallsDisabled ? `Open selected items (${selectedCalls?.length ?? 0})` : undefined}
                placement="bottomLeft"
            >
                <Button
                    href={!openCallsDisabled && selectedCalls ? createCallUrl(selectedCalls) : undefined}
                    disabled={openCallsDisabled}
                    type="default"
                    icon={<LinkOutlined />}
                />
            </Tooltip>
        </>
    );
};

export default CallsControls;
