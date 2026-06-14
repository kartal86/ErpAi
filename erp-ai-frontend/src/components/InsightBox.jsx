export default function InsightBox({ insight }) {
  if (!insight) return null;

  return (
    <div className="insight-box">
      <h3>🤖 AI Yorumu</h3>
      <p>{insight}</p>
    </div>
  );
}