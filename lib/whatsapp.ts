type SendTemplateResult = { success: boolean; messageId?: string; error?: string };

export async function sendTemplate(
  to: string,
  templateName: string,
  bodyParams: Array<string | number>,
  buttonParams: string[] = [],
): Promise<SendTemplateResult> {
  try {
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

    if (!phoneNumberId || !accessToken) {
      return { success: false, error: "Missing WhatsApp credentials" };
    }

    const url = `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`;
    const bodyParameters = bodyParams.map((p) =>
      typeof p === "number" ? { type: "number" as const, number: p } : { type: "text" as const, text: String(p) },
    );
    const buttonParameters = buttonParams.map((p) => ({ type: "text" as const, text: p }));
    const components: Array<{
      type: "body" | "button";
      parameters: Array<{ type: "text"; text: string } | { type: "number"; number: number }>;
      sub_type?: "url";
      index?: "0";
    }> = [];
    if (bodyParameters.length > 0) {
      components.push({ type: "body", parameters: bodyParameters });
    }
    if (buttonParameters.length > 0) {
      components.push({
        type: "button",
        sub_type: "url",
        index: "0",
        parameters: buttonParameters,
      });
    }
    const body = {
      messaging_product: "whatsapp",
      to: to.replace("+", ""),
      type: "template",
      template: {
        name: templateName,
        language: { code: "en_US" },
        components,
      },
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data: unknown = await response.json();
    if (!response.ok) {
      const error = (data as { error?: { message?: string } }).error?.message ?? "Unknown error";
      return { success: false, error };
    }

    const messageId = (data as { messages?: Array<{ id?: string }> }).messages?.[0]?.id;
    return { success: true, messageId };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}
