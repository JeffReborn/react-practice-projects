type FilterProps = {
  currentFilter: string;
  onToggleFilter: (filter: string) => void;
};
export default function Filter({ currentFilter, onToggleFilter }: FilterProps) {
  return (
    <div>
      <h2>Filter</h2>
      <label>
        <input
          type="radio"
          name="filter"
          value="all"
          checked={currentFilter === 'all'}
          onChange={(e) => onToggleFilter(e.target.value)}
        />
        All
      </label>
      <label>
        <input
          type="radio"
          name="filter"
          value="completed"
          checked={currentFilter === 'completed'}
          onChange={(e) => onToggleFilter(e.target.value)}
        />
        Completed
      </label>
      <label>
        <input
          type="radio"
          name="filter"
          value="unCompleted"
          checked={currentFilter === 'unCompleted'}
          onChange={(e) => onToggleFilter(e.target.value)}
        />
        Not Completed
      </label>
    </div>
  );
}
