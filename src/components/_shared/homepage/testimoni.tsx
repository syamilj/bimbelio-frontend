import AnimatedGradientText from '../../magicui/animated-gradient-text';

const Testimoni = () => {
  const dummyTestimoni: any = [
    {
      start: 5,
      heading: 'Masa Depan Pembelajaran',
      comment:
        'Integrasi AI dalam pendidikan merepresentasikan masa depan pembelajaran, di mana metode yang dipersonalisasi dan adaptif menghasilkan hasil yang lebih baik bagi siswa.',
      name: 'Eric Schmidt',
      profesi: 'Mantan CEO Google',
    },
    {
      start: 5,
      heading: 'AI dan Akses Pendidikan',
      comment:
        'AI dapat mendemokratisasi akses ke pendidikan berkualitas tinggi, menghilangkan hambatan dan membuka peluang bagi pelajar di seluruh dunia.',
      name: 'Daphne Koller',
      profesi: 'Co-founder Coursera',
    },
    {
      start: 5,
      heading: 'Memberdayakan Pelajar',
      comment:
        'Kombinasi AI dan pendidikan dapat memberdayakan pelajar untuk mencapai potensi tertinggi mereka dengan menyesuaikan pengalaman belajar sesuai kebutuhan individu.',
      name: 'Sundar Pichai',
      profesi: 'CEO of Alphabet Inc. and Google LLC',
    },
  ];
  return (
    <div
      id="testimoni"
      className=""
    >
      <div className="mb-[2rem] flex flex-col justify-center">
        <h1 className="text-center text-[1.5rem] font-bold md:text-[2.5rem]">
          <AnimatedGradientText>
            Bagaimana Pendapat Para Ahli?
          </AnimatedGradientText>
        </h1>
        <p className="text-regular text-center text-main-gray-text">
          Opini tentang belajar dan AI dari beberapa ahli.
        </p>
      </div>
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 justify-center gap-[2rem] px-[1.5rem] py-[3rem] md:grid-cols-3">
        {dummyTestimoni.map((item: any, i: number) => (
          <div
            key={i}
            className="flex h-[300px] flex-col justify-between rounded-[1rem] bg-white p-[1.5rem]  bg-white/50"
          >
            <div className="flex flex-col gap-[1rem]">
              {/* <div className="flex gap-[.5rem] items-center">
                  <div className="flex">
                    <i className="bx bxs-star text-main-yellow" />
                    <i className="bx bxs-star text-main-yellow" />
                    <i className="bx bxs-star text-main-yellow" />
                    <i className="bx bxs-star text-main-yellow" />
                    <i className="bx bxs-star text-main-yellow" />
                  </div>
                  <p>
                    <span className="font-semibold">{item.start.toFixed(1)}</span>{' '}
                    <span className="text-main-gray-text">/ 5.0</span>
                  </p>
                </div> */}
              <p className="text-[1.2rem] font-semibold">{item.heading}</p>
              <p className="font-regular text-main-gray-text">{item.comment}</p>
            </div>
            <div>
              <p className="font-medium text-black">{item.name}</p>
              <p className="text-[.9rem] text-main">{item.profesi}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimoni;
