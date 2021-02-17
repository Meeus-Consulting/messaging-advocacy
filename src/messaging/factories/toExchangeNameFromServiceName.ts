export const toExchangeNameFromServiceName = (serviceName: string):string => {
    return `${serviceName}:event:outbound`;
}
