import { databaseId, notion } from "./notion";
import { IdProps } from "./type";

//notionのqueryを取得する
export const getNotionQuery = async () => {
  const data = await notion.databases.query({
    database_id: databaseId || "",
    sorts: [
      {
        property: "created_at",
        direction: "ascending",
      },
    ],
  });
  return data;
};

//pageIdの取得
export const getNotionApiForId = async () => {
  const data = await getNotionQuery();
  const result = data.results;

  const tags = result.map((cur: any) => {
    const tag = cur.properties["ジャンル"];
    const tagName = tag.multi_select[0];
    return tagName;
  });
  const newTags: IdProps[] = tags.filter(
    (element, index, self) =>
      self.findIndex((e) => e.id === element.id) === index
  );
  return newTags;
};

//pageIdにあったpropatieを返す
export const getNotionApiFillterProperties = async (id: string) => {
  const data = await getNotionQuery();
  const result = data.results;
  const properties = result.filter((prop: any) => {
    const data = prop.properties;
    const tag = data["ジャンル"];
    const tagId = tag.multi_select[0].id;
    return tagId === id;
  });
  return properties;
};

//オブジェクトの型を簡略化する
export const getNotionApiNewObject = async (props: any) => {
  const result = props;
  const newObject = result.map((cur: any) => {
    const id = cur.id;
    const properties = cur.properties;
    return { id, properties };
  });
  return newObject;
};
