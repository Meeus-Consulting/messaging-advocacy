export const toExchangeNameFromServiceName = (serviceName: string):string => {
    return `${serviceName}.events.outbound`
}