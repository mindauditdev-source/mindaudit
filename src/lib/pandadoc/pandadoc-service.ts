/**
 * PandaDocService
 * Handles interactions with the PandaDoc API
 */
export class PandaDocService {
  private static API_KEY = process.env.PANDADOC_API_KEY;
  private static BASE_URL = "https://api.pandadoc.com/public/v1";

  /**
   * Creates a document from a template and sends it to the recipient
   */
  static async createAndSendDocument(data: {
    templateUuid: string;
    recipientEmail: string;
    recipientFirstName: string;
    recipientLastName: string;
    userId: string;
  }) {
    if (!this.API_KEY) {
      throw new Error("PANDADOC_API_KEY is not configured");
    }

    // 1. Create Document from Template
    const createResponse = await fetch(`${this.BASE_URL}/documents`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `API-Key ${this.API_KEY}`,
      },
      body: JSON.stringify({
        name: `Contrato de Partner - ${data.recipientFirstName} ${data.recipientLastName}`,
        template_uuid: data.templateUuid,
        recipients: [
          {
            email: data.recipientEmail,
            first_name: data.recipientFirstName,
            last_name: data.recipientLastName,
            role: "Partner", // Role name defined in the PandaDoc template
          },
        ],
        metadata: {
          userId: data.userId,
        },
        tags: ["partner_contract", data.userId],
      }),
    });

    if (!createResponse.ok) {
      const error = await createResponse.json();
      throw new Error(`PandaDoc Create Error: ${error.message || createResponse.statusText}`);
    }

    const docData = await createResponse.json();
    const documentId = docData.id;

    // 2. Wait for document to be processed (status 0 -> 2)
    // In a production environment, you might want a more robust polling or handle it asynchronously.
    // For now, let's wait a few seconds and try to send.
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // 3. Send the Document
    const sendResponse = await fetch(`${this.BASE_URL}/documents/${documentId}/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `API-Key ${this.API_KEY}`,
      },
      body: JSON.stringify({
        message: "Hola, aquí tienes tu contrato de colaboración con MindAudit®. Por favor, rírmalo para activar tus beneficios.",
        subject: "Firma de Contrato MindAudit®",
        silent: false,
      }),
    });

    if (!sendResponse.ok) {
      const error = await sendResponse.json();
      throw new Error(`PandaDoc Send Error: ${error.message || sendResponse.statusText}`);
    }

    return await sendResponse.json();
  }
}
