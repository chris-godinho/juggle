// Donate.jsx

export default function Donate() {
  const handleDonateClick = () => {
    window.open("https://donate.stripe.com/8wM3dFa433Urdva6oo", "_blank");
  };

  return (
    <div className="modal-inner-content-jg">
      <svg
        className="donate-logo-jg juggler-logo-jg"
        xmlns="http://www.w3.org/2000/svg"
        width="1024"
        height="1024"
        viewBox="0 0 1024 1024"
        version="1.1"
      >
        <path
          d="M 252.113 177.545 C 216.936 185.176, 189.793 210.327, 179.317 245 C 175.819 256.577, 174.911 278.915, 177.461 290.657 C 184.035 320.925, 201.953 344.470, 228.500 357.725 C 238.447 362.691, 244.234 364.607, 255.035 366.508 C 297.216 373.931, 338.764 352.989, 358.260 314.478 C 368.843 293.574, 370.881 264.468, 363.368 241.535 C 358.885 227.847, 347.829 210.558, 337.692 201.380 C 324.835 189.741, 309.273 181.625, 292.761 177.947 C 282.284 175.613, 261.944 175.412, 252.113 177.545 M 732.113 193.545 C 696.936 201.176, 669.793 226.327, 659.317 261 C 655.819 272.577, 654.911 294.915, 657.461 306.657 C 664.035 336.925, 681.953 360.470, 708.500 373.725 C 718.447 378.691, 724.234 380.607, 735.035 382.508 C 777.216 389.931, 818.764 368.989, 838.260 330.478 C 848.843 309.574, 850.881 280.468, 843.368 257.535 C 838.885 243.847, 827.829 226.558, 817.692 217.380 C 804.835 205.741, 789.273 197.625, 772.761 193.947 C 762.284 191.613, 741.944 191.412, 732.113 193.545 M 252.113 657.545 C 216.936 665.176, 189.793 690.327, 179.317 725 C 175.819 736.577, 174.911 758.915, 177.461 770.657 C 184.035 800.925, 201.953 824.470, 228.500 837.725 C 238.447 842.691, 244.234 844.607, 255.035 846.508 C 297.216 853.931, 338.764 832.989, 358.260 794.478 C 368.843 773.574, 370.881 744.468, 363.368 721.535 C 358.885 707.847, 347.829 690.558, 337.692 681.380 C 324.835 669.741, 309.273 661.625, 292.761 657.947 C 282.284 655.613, 261.944 655.412, 252.113 657.545 M 732.113 657.545 C 696.936 665.176, 669.793 690.327, 659.317 725 C 655.819 736.577, 654.911 758.915, 657.461 770.657 C 664.035 800.925, 681.953 824.470, 708.500 837.725 C 718.447 842.691, 724.234 844.607, 735.035 846.508 C 777.216 853.931, 818.764 832.989, 838.260 794.478 C 848.843 773.574, 850.881 744.468, 843.368 721.535 C 838.885 707.847, 827.829 690.558, 817.692 681.380 C 804.835 669.741, 789.273 661.625, 772.761 657.947 C 762.284 655.613, 741.944 655.412, 732.113 657.545"
          stroke="none"
          fill-rule="evenodd"
        />
        <path
          d="M 492.113 49.545 C 456.936 57.176, 429.793 82.327, 419.317 117 C 415.819 128.577, 414.911 150.915, 417.461 162.657 C 424.035 192.925, 441.953 216.470, 468.500 229.725 C 478.447 234.691, 484.234 236.607, 495.035 238.508 C 537.216 245.931, 578.764 224.989, 598.260 186.478 C 608.843 165.574, 610.881 136.468, 603.368 113.535 C 598.885 99.847, 587.829 82.558, 577.692 73.380 C 564.835 61.741, 549.273 53.625, 532.761 49.947 C 522.284 47.613, 501.944 47.412, 492.113 49.545 M 124.113 417.545 C 88.936 425.176, 61.793 450.327, 51.317 485 C 47.819 496.577, 46.911 518.915, 49.461 530.657 C 56.035 560.925, 73.953 584.470, 100.500 597.725 C 110.447 602.691, 116.234 604.607, 127.035 606.508 C 169.216 613.931, 210.764 592.989, 230.260 554.478 C 240.843 533.574, 242.881 504.468, 235.368 481.535 C 230.885 467.847, 219.829 450.558, 209.692 441.380 C 196.835 429.741, 181.273 421.625, 164.761 417.947 C 154.284 415.613, 133.944 415.412, 124.113 417.545 M 860.113 417.545 C 824.936 425.176, 797.793 450.327, 787.317 485 C 783.819 496.577, 782.911 518.915, 785.461 530.657 C 792.035 560.925, 809.953 584.470, 836.500 597.725 C 846.447 602.691, 852.234 604.607, 863.035 606.508 C 905.216 613.931, 946.764 592.989, 966.260 554.478 C 976.843 533.574, 978.881 504.468, 971.368 481.535 C 966.885 467.847, 955.829 450.558, 945.692 441.380 C 932.835 429.741, 917.273 421.625, 900.761 417.947 C 890.284 415.613, 869.944 415.412, 860.113 417.545 M 492.113 785.545 C 456.936 793.176, 429.793 818.327, 419.317 853 C 415.819 864.577, 414.911 886.915, 417.461 898.657 C 424.035 928.925, 441.953 952.470, 468.500 965.725 C 478.447 970.691, 484.234 972.607, 495.035 974.508 C 537.216 981.931, 578.764 960.989, 598.260 922.478 C 608.843 901.574, 610.881 872.468, 603.368 849.535 C 598.885 835.847, 587.829 818.558, 577.692 809.380 C 564.835 797.741, 549.273 789.625, 532.761 785.947 C 522.284 783.613, 501.944 783.412, 492.113 785.545"
          stroke="none"
          fill-rule="evenodd"
        />
      </svg>

      <h1>Support Us</h1>
      <div className="donate-blurb-text-jg">
        <p>We hope you are enjoying Juggler! </p>
        <p>
          If you would like to support us, please consider donating to our
          cause. We are a small team of developers who are passionate about
          helping people achieve their goals.
        </p>
        <p>
          Your donation will help us continue to improve Juggler and provide you
          with the best experience possible.
        </p>
      </div>
      <button onClick={handleDonateClick} className="button-jg">
        Donate
      </button>
    </div>
  );
}
