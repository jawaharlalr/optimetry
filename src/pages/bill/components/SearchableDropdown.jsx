import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export default function SearchableDropdown({ value, list, onChange, placeholder }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState(value || "");
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });

  useEffect(() => {
    setInput(value || "");
  }, [value]);

  const filtered = list.filter((item) =>
    item.toLowerCase().includes(input.toLowerCase())
  );

  const updatePos = () => {
    const rect = inputRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
      width: rect.width,
    });
  };

  useEffect(() => {
    if (open) updatePos();
    window.addEventListener("scroll", updatePos);
    window.addEventListener("resize", updatePos);

    return () => {
      window.removeEventListener("scroll", updatePos);
      window.removeEventListener("resize", updatePos);
    };
  }, [open]);

  useEffect(() => {
    const handle = (e) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(e.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  return (
    <>
      <input
        ref={inputRef}
        className="w-full p-1 border rounded"
        placeholder={placeholder}
        value={input}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          const val = e.target.value;
          setInput(val);
          setOpen(true);
        }}
      />

      {open &&
        createPortal(
          <div
            ref={dropdownRef}
            className="absolute bg-white border rounded shadow max-h-40 overflow-y-auto z-[99999]"
            style={{
              top: pos.top,
              left: pos.left,
              width: pos.width,
            }}
          >
            {filtered.length === 0 ? (
              <div className="p-2 text-sm text-gray-500">No results</div>
            ) : (
              filtered.map((item, index) => (
                <div
                  key={index}
                  onMouseDown={() => {
                    onChange(item);
                    setInput(item);
                    setOpen(false);
                  }}
                  className="p-2 text-sm cursor-pointer hover:bg-gray-100"
                >
                  {item}
                </div>
              ))
            )}
          </div>,
          document.body
        )}
    </>
  );
}
