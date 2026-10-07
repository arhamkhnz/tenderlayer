import { ImageResponse } from "next/og";

// Timeless Serif T outlined at wght: 300 and STYL: 100.
const tPath = "M268.116 45.549 L177.423 45.549 Q126.423 45.549 98.926 55.901 Q71.429 66.253 56.418 93.685 Q41.408 121.118 34.161 175.983 L0.000 175.983 L10.352 0.000 L598.198 0.000 L608.696 175.983 L574.534 175.983 Q567.288 121.118 552.277 93.685 Q537.267 66.253 509.770 55.901 Q482.272 45.549 431.273 45.549 L340.580 45.549 L340.580 662.526 L268.116 662.526 Z M171.843 683.230 Q206.004 681.159 225.155 675.239 Q244.306 669.319 255.694 654.455 Q267.081 639.590 267.081 610.766 L340.450 610.766 Q341.615 640.787 351.449 655.077 Q361.284 669.368 380.435 675.264 Q399.586 681.159 436.853 683.230 L436.853 719.462 L171.843 719.462 L171.843 683.230 Z";

export function createIconImage(size: number) {
  const height = size * 0.64;

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        background: "white",
      }}
    >
      <svg
        width={height * 608.6956521739131 / 719.4616977225674}
        height={height}
        viewBox="0 0 608.6956521739131 719.4616977225674"
        fill="#282828"
      >
        <path d={tPath} />
      </svg>
    </div>,
    { width: size, height: size },
  );
}
