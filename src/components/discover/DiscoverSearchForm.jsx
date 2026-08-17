import { Search, X } from 'lucide-react';
import {
  InlineSearchBar,
  SearchClearIconBtn,
  SearchForm,
  SearchSubmitBtn,
} from './styles';
import { SearchInput } from '../layout/BookToolbarStyles';

function DiscoverSearchForm({
  searchInput,
  submittedQuery,
  loading,
  onSearchInputChange,
  onSubmit,
  onClear,
}) {
  return (
    <SearchForm onSubmit={onSubmit}>
      <InlineSearchBar>
        <Search className="search-icon" aria-hidden />
        <SearchInput
          type="search"
          value={searchInput}
          onChange={onSearchInputChange}
          placeholder="Enter title, author, or keywords"
          aria-label="Search Books"
        />
        {searchInput && (
          <SearchClearIconBtn
            type="button"
            onClick={onClear}
            title="Clear Search"
            aria-label="Clear Search"
          >
            <X aria-hidden />
          </SearchClearIconBtn>
        )}
      </InlineSearchBar>
      <SearchSubmitBtn
        type="submit"
        disabled={!searchInput.trim() || loading || searchInput.trim() === submittedQuery}
      >
        Search
      </SearchSubmitBtn>
    </SearchForm>
  );
}

export default DiscoverSearchForm;
