import * as _ from "lodash";
import * as React from "react";
import { getPhotos, searchPhotos } from "../src/api";
import ImageCard from "../src/components/ImageCard";
import Loader from "../src/components/Loader";
import SearchBar from "../src/components/SearchBar";

enum LoadType {
  DEFAULT,
  SEARCH,
}

const Home = () => {
  const [loading, setLoading] = React.useState(false);
  const [photos, setPhotos] = React.useState([]);
  const [error, setError] = React.useState(null);
  const [pageSize, setPageSize] = React.useState(12);
  const [loadType, setLoadType] = React.useState<LoadType>(LoadType.DEFAULT);

  const lastSearchQueryRef = React.useRef("");

  React.useEffect(() => {
    window.removeEventListener("scroll", scrollCallback);
    window.addEventListener("scroll", scrollCallback);

    if (photos.length === 0 && loadType === LoadType.DEFAULT) {
      loadPhotos(1);
    }

    return () => {
      window.removeEventListener("scroll", scrollCallback);
    };
  }, [photos]);

  const handleScroll = () => {
    const element = document.scrollingElement;
    if (element.scrollHeight - element.scrollTop === element.clientHeight) {
      loadNext();
    }
  };

  const scrollCallback = React.useCallback(handleScroll, [photos]);

  const loadNext = () => {
    const nextPage = Math.ceil(photos.length / 12) + 1;
    if (loadType === LoadType.DEFAULT) {
      loadPhotos(nextPage);
    } else {
      doSearch(lastSearchQueryRef.current, nextPage);
    }
  };

  const loadPhotos = (page: number = 1) => {
    setLoading(true);
    lastSearchQueryRef.current = "";
    getPhotos(page, pageSize)
      .then(({ data, error }) => {
        if (error) {
          setError(error);
        } else {
          const photosList = _.concat([], photos, data);
          setPhotos(photosList);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const doSearch = (searchTerm: string, page: number = 1) => {
    let term = _.trim(searchTerm);

    // Search only if a valid search query is found
    if (term) {
      setLoadType(LoadType.SEARCH);
      if (lastSearchQueryRef.current === term && page === 1) {
        // Stop any attempt to refetch the first page of photos if the query has not changed
        return;
      }

      //If we are here, the assumption is that a new search query has been fired
      if (page === 1) {
        // Reset the list of photos if the first page is being requested
        setPhotos([]);
      }
      setLoading(true);
      searchPhotos(term, page, pageSize)
        .then(({ data, error }) => {
          if (error) {
            setError(error);
          } else {
            let photosList = [];

            if (page > 1) {
              //if the request is for a page greater than 1, we need to append the results to the existing ones
              photosList = _.concat([], photos, data);
            } else {
              //else just replace the list
              photosList = data;
            }
            setPhotos(photosList);
            lastSearchQueryRef.current = term;
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return (
    <div className={"main"}>
      {/* Search */}
      <SearchBar onSearch={doSearch} />
      {/* Images */}
      <div className={"image-container"}>
        {_.size(photos) > 0
          ? _.map(photos, (photo) => {
              return <ImageCard key={_.get(photo, "id")} {...photo} />;
            })
          : null}
      </div>

      {loading ? (
        <div className={"loading-spinner-container"}>
          <Loader />
        </div>
      ) : null}
    </div>
  );
};

export default Home;
