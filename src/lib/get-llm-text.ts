interface LLMPage {
  url: string;
  data: {
    title: string;
    getText: (format: "processed") => Promise<string>;
  };
}

export async function getLLMText(page: LLMPage) {
  const processed = await page.data.getText("processed");

  return `# ${page.data.title} (${page.url})

${processed}`;
}
