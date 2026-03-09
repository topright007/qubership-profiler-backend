/**
 *  Creates proxy configuration for webpack dev server
 * @param {Record<string, string>} env process.env
 * @returns
 */
export default function createProxy(env) {
    const { API_URL } = env;

    return [
        {
            context: ['/esc'],
            target: API_URL,
            changeOrigin: true,
            secure: false,
            logLevel: 'debug',
        },
        {
            context: ['/cdt'],
            target: API_URL,
            changeOrigin: true,
            pathRewrite: {
                '^/cdt': '/cdt',
            },
            secure: false,
        },
    ];
}
