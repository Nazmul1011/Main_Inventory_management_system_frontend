import React from "react";
import SectionHeader from "./section_header.";

const Testimonials = () => {
  return (
    <div className="bg-colorBg max-w-screen-2xl mx-auto px-4 md:px-8 py-12 md:py-20">
      <div className="section-container text-center">
        <SectionHeader
          header="What Our Clients Say"
          subheader="Testimonials"
          description="We take pride in building long-term partnerships with our clients. Here’s what some of them have to say about working with us."
        />

        {/* testimonial carousel */}
        <div>
          <div className="carousel w-full">
            {/* ===== Slide 1 ===== */}
            <div
              id="slide1"
              className="carousel-item md:space-x-8 relative w-full"
            >
              <div className="md:w-1/2 bg-white rounded-md shadow md:p-8 p-4">
                <img
                  src="/images/logos/logo1.png"
                  className="size-28 mx-auto my-2 object-contain"
                />
                <p className="text-gray-600 italic mb-4 md:w-3/5 mx-auto">
                  "Working with this team has been a game-changer for our
                  company. Their attention to detail, clean UI design, and
                  ability to deliver under tight deadlines are truly
                  impressive."
                </p>

                <div className="flex flex-col items-center space-y-2">
                  <div className="size-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold">
                    J
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">John Doe</h3>
                  <p className="text-sm text-gray-500">CEO, TechCorp</p>
                </div>
              </div>

              <div className="md:w-1/2 bg-white rounded-md shadow md:p-8 p-4">
                <img
                  src="/images/logos/logo2.png"
                  className="size-28 mx-auto my-2 object-contain"
                />
                <p className="text-gray-600 italic mb-4 md:w-3/5 mx-auto">
                  "They built a platform that completely transformed how we
                  manage our operations. The communication was seamless, and the
                  final product exceeded our expectations."
                </p>

                <div className="flex flex-col items-center space-y-2">
                  <div className="size-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold">
                    S
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">
                    Jane Smith
                  </h3>
                  <p className="text-sm text-gray-500">
                    Marketing Lead, BizSoft
                  </p>
                </div>
              </div>

              <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                <a href="#slide4" className="btn btn-circle">
                  ❮
                </a>
                <a href="#slide2" className="btn btn-circle">
                  ❯
                </a>
              </div>
            </div>

            {/* ===== Slide 2 ===== */}
            <div
              id="slide2"
              className="carousel-item md:space-x-8 relative w-full"
            >
              <div className="md:w-1/2 bg-white rounded-md shadow md:p-8 p-4">
                <img
                  src="/images/logos/logo1.png"
                  className="size-28 mx-auto my-2 object-contain"
                />
                <p className="text-gray-600 italic mb-4 md:w-3/5 mx-auto">
                  "From concept to deployment, the entire process was handled
                  with professionalism and creativity. Their backend integration
                  and performance optimization are top-notch."
                </p>

                <div className="flex flex-col items-center space-y-2">
                  <div className="size-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold">
                    A
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">
                    Abdul Haque
                  </h3>
                  <p className="text-sm text-gray-500">CTO, Nova Systems</p>
                </div>
              </div>

              <div className="md:w-1/2 bg-white rounded-md shadow md:p-8 p-4">
                <img
                  src="/images/logos/logo2.png"
                  className="size-28 mx-auto my-2 object-contain"
                />
                <p className="text-gray-600 italic mb-4 md:w-3/5 mx-auto">
                  "A highly skilled and dependable team. They not only deliver
                  great products but also provide valuable insights that helped
                  improve our business workflow."
                </p>

                <div className="flex flex-col items-center space-y-2">
                  <div className="size-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold">
                    W
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">
                    Watson Smith
                  </h3>
                  <p className="text-sm text-gray-500">
                    Operations Head, FinEdge
                  </p>
                </div>
              </div>

              <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                <a href="#slide1" className="btn btn-circle">
                  ❮
                </a>
                <a href="#slide3" className="btn btn-circle">
                  ❯
                </a>
              </div>
            </div>

            {/* ===== Slide 3 ===== */}
            <div
              id="slide3"
              className="carousel-item md:space-x-8 relative w-full"
            >
              <div className="md:w-1/2 bg-white rounded-md shadow md:p-8 p-4">
                <img
                  src="/images/logos/logo1.png"
                  className="size-28 mx-auto my-2 object-contain"
                />
                <p className="text-gray-600 italic mb-4 md:w-3/5 mx-auto">
                  "Their expertise in UI/UX helped us build a dashboard that’s
                  not just functional but genuinely enjoyable to use. Highly
                  recommend them for any scalable product development."
                </p>

                <div className="flex flex-col items-center space-y-2">
                  <div className="size-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold">
                    K
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">
                    Kabir Tapai
                  </h3>
                  <p className="text-sm text-gray-500">Founder, CloudBase</p>
                </div>
              </div>

              <div className="md:w-1/2 bg-white rounded-md shadow md:p-8 p-4">
                <img
                  src="/images/logos/logo2.png"
                  className="size-28 mx-auto my-2 object-contain"
                />
                <p className="text-gray-600 italic mb-4 md:w-3/5 mx-auto">
                  "Our collaboration was smooth from day one. The project was
                  delivered on time, within budget, and exactly to our
                  specifications. Truly a reliable partner."
                </p>

                <div className="flex flex-col items-center space-y-2">
                  <div className="size-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold">
                    S
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">
                    Jane Smith
                  </h3>
                  <p className="text-sm text-gray-500">
                    Marketing Lead, BizSoft
                  </p>
                </div>
              </div>

              <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                <a href="#slide2" className="btn btn-circle">
                  ❮
                </a>
                <a href="#slide4" className="btn btn-circle">
                  ❯
                </a>
              </div>
            </div>

            {/* ===== Slide 4 ===== */}
            <div id="slide4" className="carousel-item relative w-full">
              <div className="md:w-1/2 bg-white rounded-md shadow md:p-8 p-4">
                <img
                  src="/images/logos/logo1.png"
                  className="size-28 mx-auto my-2 object-contain"
                />
                <p className="text-gray-600 italic mb-4 md:w-3/5 mx-auto">
                  "They consistently deliver excellent results with remarkable
                  professionalism. Our productivity and system efficiency have
                  improved drastically since partnering with them."
                </p>

                <div className="flex flex-col items-center space-y-2">
                  <div className="size-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold">
                    J
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">John Doe</h3>
                  <p className="text-sm text-gray-500">CEO, TechCorp</p>
                </div>
              </div>

              <div className="md:w-1/2 bg-white rounded-md shadow md:p-8 p-4">
                <img
                  src="/images/logos/logo2.png"
                  className="size-28 mx-auto my-2 object-contain"
                />
                <p className="text-gray-600 italic mb-4 md:w-3/5 mx-auto">
                  "Their approach to project management and quality assurance is
                  unmatched. We always feel supported, and the post-delivery
                  support is just as solid as their development work."
                </p>

                <div className="flex flex-col items-center space-y-2">
                  <div className="size-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold">
                    S
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">
                    Sarah Collins
                  </h3>
                  <p className="text-sm text-gray-500">COO, BrightWorks</p>
                </div>
              </div>

              <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                <a href="#slide3" className="btn btn-circle">
                  ❮
                </a>
                <a href="#slide1" className="btn btn-circle">
                  ❯
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
