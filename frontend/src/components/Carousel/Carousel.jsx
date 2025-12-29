import "./Carousel.css";


export default function Carousel() {
  const slides = [
    {
      img: "../banner1.png",
      title: "Bem-vindo ao Portal Educacional",
      text: "Encontre conteúdos, aulas e publicações de professores.",
    },
    {
      img: "/banner2.png",
      title: "Busque por tema",
      text: "Use a busca para achar conteúdos específicos.",
    },
    {
      img: "/banner3.png",
      title: "Área do Professor",
      text: "Crie e gerencie posts com login.",
    },
  ];

  return (
    <div
      id="homeCarousel"
      className="carousel slide mb-4"
      data-bs-ride="carousel"
    >
      {/* Indicadores */}
      <div className="carousel-indicators">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            data-bs-target="#homeCarousel"
            data-bs-slide-to={i}
            className={i === 0 ? "active" : ""}
            aria-current={i === 0 ? "true" : undefined}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Slides */}
      <div className="carousel-inner rounded overflow-hidden">
        {slides.map((s, i) => (
          <div key={s.img} className={`carousel-item ${i === 0 ? "active" : ""}`}>
            <img
              src={s.img}
              className="d-block w-100 home-carousel-img"
              alt={s.title}
              loading={i === 0 ? "eager" : "lazy"}
            />

          </div>
        ))}
      </div>

      {/* Controles */}
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#homeCarousel"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true" />
        <span className="visually-hidden">Anterior</span>
      </button>

      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#homeCarousel"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true" />
        <span className="visually-hidden">Próximo</span>
      </button>
    </div>
  );
}
