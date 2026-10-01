interface DateRangeFilterProps {
  StartDate: string;
  EndDate: string;
  OnChange: (startDate: string, endDate: string) => void;
}

export default function DateRangeFilter({ StartDate, EndDate, OnChange }: DateRangeFilterProps) {
  return (
    <div className="flex flex-wrap items-end gap-3">
      <div>
        <label className="label">Dari Tanggal</label>
        <input type="date" className="input" value={StartDate} onChange={(event) => OnChange(event.target.value, EndDate)} />
      </div>
      <div>
        <label className="label">Sampai Tanggal</label>
        <input type="date" className="input" value={EndDate} onChange={(event) => OnChange(StartDate, event.target.value)} />
      </div>
    </div>
  );
}
