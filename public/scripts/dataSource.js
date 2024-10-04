export async function loadData(opt) {
  const { id, rootId = 1, sheet } = opt;
  const googleSheetUrl = `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:csv&sheet=${sheet}`;

  // parse CSV data into array of object with shape:
  // {
  //   id: number,
  //   name: string,
  //   isMale: boolean,
  //   siblingRank: number,
  //   fatherId: number,
  // }

  const peopleMap = (
    await fetch(googleSheetUrl)
      .then((res) => {
        if (res.status !== 200) throw new Error("Failed to fetch data");
        return res.text();
      })
      .catch((err) => {
        alert("無法讀取資料，請檢查你的資料 id 是否正確。");
      })
  )
    .split("\n") // block of text into lines
    .slice(1) // skip header
    .filter((l) => !!l) // skip empty lines
    .map((line) => {
      // line into object
      const [id, name, isMale, siblingRank, fatherId] = line
        .split(",")
        .map((s) => s.replace(/"/g, ""));

      return {
        id: Number(id),
        name,
        isMale: isMale === "true",
        siblingRank: Number(siblingRank),
        fatherId: Number(fatherId),
        children: [],
      };
    })
    .sort(
      // sort by father id, and sibling rank
      (a, b) =>
        a.fatherId !== b.fatherId
          ? a.fatherId - b.fatherId
          : a.siblingRank - b.siblingRank // tie breaker
    )
    .reduce((acc, p) => {
      // convert to tree structure
      acc[p.id] = p;
      acc[p.fatherId]?.children.push(p); // GOTCHA: children has to appear after
      return acc;
    }, {});

  return peopleMap[rootId]; // root is always the person with id 1
}
