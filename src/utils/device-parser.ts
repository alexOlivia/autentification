import UAParser from 'ua-parser-js';

export interface DeviceInfo {
  appareil: string;
  navigateur: string;
  systemeExploitation: string;
}

export function parseUserAgent(userAgent: string | undefined): DeviceInfo {
  if (!userAgent) {
    return { appareil: 'Inconnu', navigateur: 'Inconnu', systemeExploitation: 'Inconnu' };
  }
  // UAParser v2 avec module NodeNext : forcer le constructeur
  const Parser = (UAParser as any).default ?? UAParser;
  const parser = new Parser(userAgent);
  const device = parser.getDevice();
  const browser = parser.getBrowser();
  const os = parser.getOS();

  return {
    appareil: device.model
      ? `${device.vendor ?? ''} ${device.model}`.trim()
      : device.type ?? 'Desktop',
    navigateur: browser.name
      ? `${browser.name} ${browser.version ?? ''}`.trim()
      : 'Inconnu',
    systemeExploitation: os.name
      ? `${os.name} ${os.version ?? ''}`.trim()
      : 'Inconnu',
  };
}
