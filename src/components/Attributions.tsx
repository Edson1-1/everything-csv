export function Attributions() {
  const attributions = [
    {
      title: "Csv icons created by kliwir art - Flaticon",
      link: "https://www.flaticon.com/free-icons/csv"
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Attributions</h1>
      
      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">Attributions List</h2>
          <ul className="space-y-3">
            {attributions.map((attribution, index) => (
              <li key={index}>
                <a 
                  href={attribution.link}
                  className="text-white underline"
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  {attribution.title}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="mt-8 pt-4 border-t">
        <button 
          onClick={() => window.history.back()}
          className="text-white hover:underline"
        >
          ← Back
        </button>
      </div>
    </div>
  );
}