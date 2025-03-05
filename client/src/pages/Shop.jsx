const Shop = () => {
  return (
    <>
      <div className="container-xxl py-5">
        <section className="filter-sidebar" aria-label="filter">
          <h1 className="fw-bold">Filters</h1>

          <div>
            <form>
              <div className="gender-filter my-3">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="men"
                  />
                  <label className="form-check-label" htmlFor="men">
                    Men
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="women"
                  />
                  <label className="form-check-label" htmlFor="women">
                    women
                  </label>
                </div>
              </div>

              <hr className="hr" />

              <div className="size-filter my-3">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="size-s"
                  />
                  <label className="form-check-label" htmlFor="size-s">
                    S
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="size-m"
                  />
                  <label className="form-check-label" htmlFor="size-m">
                    M
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="size-L"
                  />
                  <label className="form-check-label" htmlFor="size-L">
                    L
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="size-xl"
                  />
                  <label className="form-check-label" htmlFor="size-xl">
                    XL
                  </label>
                </div>
              </div>

              <hr className="hr" />

              <div className="color-filter my-3">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="color-red"
                  />
                  <label className="form-check-label" htmlFor="color-red">
                    Red
                    <span
                      className="color-indicator"
                      style={{ color: "red" }}
                    ></span>
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="color-blue"
                  />
                  <label className="form-check-label" htmlFor="color-blue">
                    Blue
                    <span
                      className="color-indicator"
                      style={{ color: "blue" }}
                    ></span>
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="color-green"
                  />
                  <label className="form-check-label" htmlFor="color-green">
                    Green
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="color-black"
                  />
                  <label className="form-check-label" htmlFor="color-black">
                    Black
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="color-white"
                  />
                  <label className="form-check-label" htmlFor="color-white">
                    White
                  </label>
                </div>
              </div>
            </form>
          </div>
          <form></form>
        </section>
        <section className="products"></section>
      </div>
    </>
  );
};

export default Shop;
