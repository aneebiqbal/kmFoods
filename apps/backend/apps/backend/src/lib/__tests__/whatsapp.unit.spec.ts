import { getWhatsAppConfig } from "../whatsapp";

/**
 * The WhatsApp number is business configuration. Until the owner supplies a
 * real Pakistani mobile number, no message may be sent — the storefront must
 * render a not-configured state instead of a link to a stranger's number.
 */
describe("getWhatsAppConfig", () => {
  const original = process.env.WHATSAPP_BUSINESS_NUMBER;

  afterEach(() => {
    if (original === undefined) {
      delete process.env.WHATSAPP_BUSINESS_NUMBER;
    } else {
      process.env.WHATSAPP_BUSINESS_NUMBER = original;
    }
  });

  it("reports unconfigured when the number is missing", () => {
    delete process.env.WHATSAPP_BUSINESS_NUMBER;
    expect(getWhatsAppConfig()).toEqual({ phone: null, configured: false });
  });

  it("reports unconfigured when the number is blank", () => {
    process.env.WHATSAPP_BUSINESS_NUMBER = "   ";
    expect(getWhatsAppConfig()).toEqual({ phone: null, configured: false });
  });

  it("reports unconfigured when the number is not a Pakistani mobile", () => {
    process.env.WHATSAPP_BUSINESS_NUMBER = "123";
    expect(getWhatsAppConfig()).toEqual({ phone: null, configured: false });
  });

  it("normalises a configured number", () => {
    process.env.WHATSAPP_BUSINESS_NUMBER = "0321 1210333";
    const config = getWhatsAppConfig();
    expect(config.configured).toBe(true);
    expect(config.phone).toBe("+923211210333");
  });
});
