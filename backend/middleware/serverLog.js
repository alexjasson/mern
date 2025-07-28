export const serverLog = (req, res, next) => {
    console.log(`Received ${req.method} request to: ${req.url}`);
    const originalSend = res.send;
    res.send = function(data) {
        const statusColor = res.statusCode >= 400 ? '\x1b[31m' : '\x1b[32m'; // Red for 4xx/5xx, Green for others
        const resetColor = '\x1b[0m';
        console.log(`Sent response for ${req.method} ${req.url} - Status: ${statusColor}${res.statusCode}${resetColor}`);
        return originalSend.call(this, data);
    };
    
    next();
};