import * as _ from "lodash";

const getPhotos = async (
  page: number = 1,
  limit: number = 12
): Promise<{ data: any[]; error: string }> => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

  let data = [];
  let error = null;

  try {
    const response = await fetch(
      `${API_URL}/photos?page=${page}&per_page=${limit}`,
      {
        headers: {
          Authorization: `Client-ID ${API_KEY}`,
        },
      }
    ).then((res) => res.json());

    if (_.isArray(response)) {
      data = response;
    }
  } catch (e) {
    error = JSON.stringify(e);
  }

  return {
    data,
    error,
  };
};

const searchPhotos = async (
  searchTerm: string,
  page: number = 1,
  limit: number = 12
): Promise<{ data: any[]; error: string }> => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

  let data = [];
  let error = null;

  try {
    const response = await fetch(
      `${API_URL}/search/photos?query=${searchTerm}&page=${page}&per_page=${limit}`,
      {
        headers: {
          Authorization: `Client-ID ${API_KEY}`,
        },
      }
    ).then((res) => res.json());

    const items = _.get(response, "results");

    if (_.isArray(items)) {
      data = items;
    }
  } catch (e) {
    error = JSON.stringify(e);
  }

  return {
    data,
    error,
  };
};

export { getPhotos, searchPhotos };
