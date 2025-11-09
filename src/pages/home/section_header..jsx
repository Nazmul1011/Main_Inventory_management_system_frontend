function SectionHeader({header,subheader,description}){
    return (
      <div className="">
        <h3 className="uppercase text-primary">{header}</h3>
        <h1 className="font-bold  text-3xl lg:text-4xl mt-2">{subheader}</h1>
        <p className="text-gray-400 mt-4 max-w-2xl mx-auto text-sm">{description}</p>
      </div>
    );
}
export default SectionHeader ;