import css from "./SearchBox.module.css";

interface SearchBoxProps {
  onChangeSearch: (newSearchValue: string) => void;
}

export default function SearchBox({ onChangeSearch }: SearchBoxProps) {
  return (
    <input
      className={css.input}
      type="text"
      placeholder="Search notes"
      onChange={(e) => onChangeSearch(e.target.value)}
    />
  );
}