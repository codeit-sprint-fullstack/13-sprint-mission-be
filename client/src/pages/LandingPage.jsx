export default function LandingPage() {
  return (
    <main>
      <section className="main-content">
        <div className="main-content-inner">
          <div className="main-text">
            <h1>
              일상의 모든 물건을
              <br />
              거래해 보세요
            </h1>
            <a className="btn-primary" href="/items">
              구경하러 가기
            </a>
          </div>
          <div className="main-img" />
        </div>
      </section>

      <section className="sub-content">
        <div className="sub-content-inner">
          <img src="/image/1.png" alt="Hot item" />
          <div className="sub-text">
            <h2>Hot item</h2>
            <h3>
              인기 상품을
              <br />
              확인해 보세요
            </h3>
            <p>
              가장 HOT한 중고거래 물품을
              <br />
              판다마켓에서 확인해 보세요
            </p>
          </div>
        </div>
      </section>

      <section className="sub-content4">
        <div className="sub-content4-inner">
          <div className="sub4-text">
            <h1>
              믿을 수 있는
              <br />
              판다마켓 중고거래
            </h1>
          </div>
          <div className="sub4-img" />
        </div>
      </section>
    </main>
  );
}
