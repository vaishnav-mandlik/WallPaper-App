import { createClient } from "@sanity/client";
import ImageUrlBuilder from "@sanity/image-url";

const sanityClient = createClient({
  projectId: "p5dipqdz",
  dataset: "production",
  useCdn: true,
  apiVersion: "2023-11-21",
});

export const urlFor = (source) => {
  return ImageUrlBuilder(sanityClient).image(source);
};

export default sanityClient;

// *[_type == 'category']{
//     name,
//   }

export const fetchCategories = async () => {
  const items = await sanityClient
    .fetch(
      `*[_type == 'category']| order(_createdAt asc){
    name,_id}`
    )
    .then((data) => {
      return data;
    });
  return items;
};

export const fetchWallpaperImages = async (categoryId) => {
  const items = await sanityClient
    .fetch(
      `*[_type == 'wallpaperImage' && references('${categoryId}')] {
        title,
        image{
            asset -> {
              url
            }
          }
    }`
    )
    .then((data) => {
      return data;
    });
  return items;
};

// *[_type == 'category' && name == 'Dark'][0] {
//     _id
//   }

export const getCategoryId = async (categoryName) => {
  const items = await sanityClient
    .fetch(
      `*[_type == 'category' && name == '${categoryName}'][0] {
            _id
        }`
    )
    .then((data) => {
      return data;
    });
  return items;
};

export const getWallpaperByTitle = async (title) => {
  const items = await sanityClient
    .fetch(
      `*[_type == 'wallpaperImage' && title match '${title}*'] {
        title,
        image{
            asset -> {
              url
            }
          }
      }`
    )
    .then((data) => {
      return data;
    });
  return items;
};
