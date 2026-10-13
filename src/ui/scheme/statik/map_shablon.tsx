export const At = ({ x, y, children }: { x: number; y: number; children: React.ReactNode }) => (
  <div className="absolute" style={{ left: x, top: y }}>{children}</div>
);