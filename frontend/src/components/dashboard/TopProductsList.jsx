const TopProductsList = ({ data }) => {
  return (
    <div className="bg-vexor-black border-[3px] border-vexor-black shadow-[6px_6px_0px_#FF5500] p-6 h-[400px] flex flex-col text-white" style={{ borderRadius: 0 }}>
      <h3 className="font-headline text-2xl font-[900] italic uppercase tracking-wider mb-6">
        TOP SELLERS <span className="text-vexor-orange">//</span> TOP 5
      </h3>
      <div className="flex-1 overflow-y-auto">
        {!data || data.length === 0 ? (
          <div className="flex h-full items-center justify-center font-heading font-bold text-secondary text-sm tracking-[0.2em]">NO DATA</div>
        ) : (
          <ul className="space-y-3">
            {data.map((product, idx) => (
              <li key={product._id} className="bg-white text-vexor-black p-3 border-[2px] border-white flex justify-between items-center group hover:bg-[#F2F2F2] transition-colors">
                <div className="flex items-center gap-4">
                  <span className="font-headline text-xl font-[900] italic text-vexor-orange w-6">#{idx + 1}</span>
                  <span className="font-bold font-heading uppercase text-sm tracking-wide group-hover:text-vexor-orange transition-colors">
                    {product._id}
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-vexor-black text-white px-3 py-1">
                  <span className="font-mono text-xs font-bold">{product.count}</span>
                  <span className="font-mono text-[10px] tracking-widest text-secondary">SOLD</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TopProductsList;
