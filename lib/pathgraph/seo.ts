export const careerPath = (careerSlug: string) => `/careers/${careerSlug}`;

export const comparisonPath = (careerA: string, careerB: string) =>
  `/compare/${[careerA, careerB].sort().join("-vs-")}`;
