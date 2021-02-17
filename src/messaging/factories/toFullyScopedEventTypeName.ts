export const toFullyScopedEventTypeName = (service: string, eventType: string, version?: string) => {
  const defaultPattern = `${service.toLowerCase()}.${eventType.toLowerCase()}`;
  return version ? `${defaultPattern}.v${version}` : `${defaultPattern}.#`;
};
