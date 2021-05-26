import * as React from "react";
import * as _ from "lodash";

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
}

const SearchBar = (props: SearchBarProps) => {
  const { onSearch = () => {} } = props;

  const [searchTerm, setSearchTerm] = React.useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className={"search-container"}>
      <input
        type={"search"}
        className={"search-bar"}
        onChange={handleChange}
        value={searchTerm}
        placeholder={"Search..."}
        onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key === "Enter") {
            const searchText = _.trim(searchTerm);

            if (searchText) {
              onSearch(searchText);
            }
          }
        }}
      />
    </div>
  );
};

export default SearchBar;
