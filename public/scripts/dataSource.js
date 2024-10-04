async function fetchGoogleSheetCSV(opt) {
  const { id, sheet } = opt;
  const googleSheetUrl = `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:csv&sheet=${sheet}`;
  try {
    const res = await fetch(googleSheetUrl);
    if (res.status === 200) return res.text();
    throw new Error("Failed to fetch data");
  } catch (err) {
    alert("無法讀取資料，請檢查你的資料 id 是否正確。");
  }
  return "";
}

// opt: id: string, sheet: string, rootId: number
export async function loadData(opt) {
  const { rootId = 1 } = opt;

  // kludge, delete first header row
  const csv = (await fetchGoogleSheetCSV(opt)).replace(/^.*\n/, "");

  const table = d3.csvParseRows(csv, (row) => {
    // process each row as follows
    const [id, name, isMale, siblingRank, fatherId, partnerName] = row.map(
      (s) => s.replace(/"/g, "") // remove extra quotes
    );

    return {
      id: Number(id),
      name,
      isMale: isMale.toLowerCase() === "true",
      siblingRank: Number(siblingRank),
      fatherId: Number(fatherId) || null,
      partnerName,
    };
  });

  // config stratify
  const stratify = d3
    .stratify()
    .id((d) => d.id)
    .parentId((d) => d.fatherId);

  const rid = `${rootId}`;
  return stratify(table) // startify
    .find((d) => d.id === rid)
    .sort(
      (a, b) =>
        a.fatherId !== b.fatherId
          ? a.fatherId - b.fatherId
          : a.siblingRank - b.siblingRank // tie breaker
    );
}
