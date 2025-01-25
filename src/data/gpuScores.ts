export interface GPUBenchmark {
  name: string;
  tdp: number;
  raster: {
    '1080p_medium': number | null;
    '1080p_ultra': number | null;
    '1440p_ultra': number | null;
    '4k_ultra': number | null;
  };
  raytracing: {
    '1080p_medium': number | null;
    '1080p_ultra': number | null;
    '1440p_ultra': number | null;
    '4k_ultra': number | null;
  };
}

const extractFPS = (value: string): number | null => {
  const match = value.match(/\((\d+\.?\d*)fps\)/);
  return match ? parseFloat(match[1]) : null;
};

export const gpuScores: GPUBenchmark[] = [
  {
    name: "GeForce RTX 4090",
    tdp: 450,
    raster: {
      '1080p_medium': 195.7,
      '1080p_ultra': 154.1,
      '1440p_ultra': 146.1,
      '4k_ultra': 114.5
    },
    raytracing: {
      '1080p_medium': 165.9,
      '1080p_ultra': 136.3,
      '1440p_ultra': 103.9,
      '4k_ultra': 55.9
    }
  },
  {
    name: "Radeon RX 7900 XTX",
    tdp: 355,
    raster: {
      '1080p_medium': 190.3,
      '1080p_ultra': 149.0,
      '1440p_ultra': 135.3,
      '4k_ultra': 95.1
    },
    raytracing: {
      '1080p_medium': 109.6,
      '1080p_ultra': 84.1,
      '1440p_ultra': 55.3,
      '4k_ultra': 27.2
    }
  },
  {
    name: "GeForce RTX 4080 Super",
    tdp: 320,
    raster: {
      '1080p_medium': 192.7,
      '1080p_ultra': 148.3,
      '1440p_ultra': 133.0,
      '4k_ultra': 91.9
    },
    raytracing: {
      '1080p_medium': 144.0,
      '1080p_ultra': 116.3,
      '1440p_ultra': 78.6,
      '4k_ultra': 39.4
    }
  },
  {
    name: "GeForce RTX 4080",
    tdp: 320,
    raster: {
      '1080p_medium': 192.0,
      '1080p_ultra': 147.0,
      '1440p_ultra': 130.4,
      '4k_ultra': 89.3
    },
    raytracing: {
      '1080p_medium': 141.6,
      '1080p_ultra': 113.6,
      '1440p_ultra': 76.0,
      '4k_ultra': 37.8
    }
  },
  {
    name: "Radeon RX 7900 XT",
    tdp: 315,
    raster: {
      '1080p_medium': 187.6,
      '1080p_ultra': 143.9,
      '1440p_ultra': 125.9,
      '4k_ultra': 81.2
    },
    raytracing: {
      '1080p_medium': 100.3,
      '1080p_ultra': 75.3,
      '1440p_ultra': 48.5,
      '4k_ultra': 23.3
    }
  },
  {
    name: "GeForce RTX 4070 Ti Super",
    tdp: 285,
    raster: {
      '1080p_medium': 189.4,
      '1080p_ultra': 142.3,
      '1440p_ultra': 122.0,
      '4k_ultra': 78.6
    },
    raytracing: {
      '1080p_medium': 128.2,
      '1080p_ultra': 100.3,
      '1440p_ultra': 66.0,
      '4k_ultra': 32.6
    }
  },
  {
    name: "GeForce RTX 4070 Ti",
    tdp: 285,
    raster: {
      '1080p_medium': 187.2,
      '1080p_ultra': 138.3,
      '1440p_ultra': 116.5,
      '4k_ultra': 73.0
    },
    raytracing: {
      '1080p_medium': 118.6,
      '1080p_ultra': 91.6,
      '1440p_ultra': 59.1,
      '4k_ultra': 29.2
    }
  },
  {
    name: "Radeon RX 7900 GRE",
    tdp: 260,
    raster: {
      '1080p_medium': 184.3,
      '1080p_ultra': 135.8,
      '1440p_ultra': 113.9,
      '4k_ultra': 69.3
    },
    raytracing: {
      '1080p_medium': 87.7,
      '1080p_ultra': 63.7,
      '1440p_ultra': 41.2,
      '4k_ultra': 19.9
    }
  },
  {
    name: "GeForce RTX 4070 Super",
    tdp: 220,
    raster: {
      '1080p_medium': 185.1,
      '1080p_ultra': 134.2,
      '1440p_ultra': 109.8,
      '4k_ultra': 66.1
    },
    raytracing: {
      '1080p_medium': 113.0,
      '1080p_ultra': 85.6,
      '1440p_ultra': 54.5,
      '4k_ultra': 26.7
    }
  },
  {
    name: "Radeon RX 6950 XT",
    tdp: 335,
    raster: {
      '1080p_medium': 179.4,
      '1080p_ultra': 130.5,
      '1440p_ultra': 110.1,
      '4k_ultra': 67.1
    },
    raytracing: {
      '1080p_medium': 80.1,
      '1080p_ultra': 56.4,
      '1440p_ultra': 35.7,
      '4k_ultra': 17.3
    }
  },
  {
    name: "GeForce RTX 3090 Ti",
    tdp: 350,
    raster: {
      '1080p_medium': 177.1,
      '1080p_ultra': 130.5,
      '1440p_ultra': 112.7,
      '4k_ultra': 75.9
    },
    raytracing: {
      '1080p_medium': 119.3,
      '1080p_ultra': 93.2,
      '1440p_ultra': 62.0,
      '4k_ultra': 31.8
    }
  },
  {
    name: "Radeon RX 7800 XT",
    tdp: 263,
    raster: {
      '1080p_medium': 179.1,
      '1080p_ultra': 129.3,
      '1440p_ultra': 105.8,
      '4k_ultra': 62.3
    },
    raytracing: {
      '1080p_medium': 77.5,
      '1080p_ultra': 57.1,
      '1440p_ultra': 36.3,
      '4k_ultra': 17.3
    }
  },
  {
    name: "GeForce RTX 3090",
    tdp: 350,
    raster: {
      '1080p_medium': 174.0,
      '1080p_ultra': 125.5,
      '1440p_ultra': 106.0,
      '4k_ultra': 70.7
    },
    raytracing: {
      '1080p_medium': 112.4,
      '1080p_ultra': 86.6,
      '1440p_ultra': 57.2,
      '4k_ultra': 28.9
    }
  },
  {
    name: "Radeon RX 6900 XT",
    tdp: 300,
    raster: {
      '1080p_medium': 175.3,
      '1080p_ultra': 124.6,
      '1440p_ultra': 102.1,
      '4k_ultra': 61.2
    },
    raytracing: {
      '1080p_medium': 75.4,
      '1080p_ultra': 52.3,
      '1440p_ultra': 33.3,
      '4k_ultra': 16.1
    }
  },
  {
    name: "GeForce RTX 3080 Ti",
    tdp: 350,
    raster: {
      '1080p_medium': 171.8,
      '1080p_ultra': 123.9,
      '1440p_ultra': 103.9,
      '4k_ultra': 68.8
    },
    raytracing: {
      '1080p_medium': 110.4,
      '1080p_ultra': 84.8,
      '1440p_ultra': 55.3,
      '4k_ultra': 27.1
    }
  },
  {
    name: "Radeon RX 6800 XT",
    tdp: 300,
    raster: {
      '1080p_medium': 173.2,
      '1080p_ultra': 122.7,
      '1440p_ultra': 99.0,
      '4k_ultra': 57.9
    },
    raytracing: {
      '1080p_medium': 70.0,
      '1080p_ultra': 48.5,
      '1440p_ultra': 31.1,
      '4k_ultra': 15.0
    }
  },
  {
    name: "GeForce RTX 3080 12GB",
    tdp: 350,
    raster: {
      '1080p_medium': 169.4,
      '1080p_ultra': 122.1,
      '1440p_ultra': 102.3,
      '4k_ultra': 66.7
    },
    raytracing: {
      '1080p_medium': 107.6,
      '1080p_ultra': 81.7,
      '1440p_ultra': 52.8,
      '4k_ultra': 25.8
    }
  },
  {
    name: "GeForce RTX 4070",
    tdp: 200,
    raster: {
      '1080p_medium': 177.5,
      '1080p_ultra': 122.0,
      '1440p_ultra': 97.8,
      '4k_ultra': 57.2
    },
    raytracing: {
      '1080p_medium': 101.4,
      '1080p_ultra': 73.9,
      '1440p_ultra': 46.9,
      '4k_ultra': 22.7
    }
  },
  {
    name: "GeForce RTX 3080",
    tdp: 320,
    raster: {
      '1080p_medium': 167.6,
      '1080p_ultra': 117.0,
      '1440p_ultra': 96.4,
      '4k_ultra': 62.0
    },
    raytracing: {
      '1080p_medium': 99.8,
      '1080p_ultra': 74.3,
      '1440p_ultra': 47.9,
      '4k_ultra': 23.3
    }
  },
  {
    name: "Radeon RX 7700 XT",
    tdp: 245,
    raster: {
      '1080p_medium': 171.6,
      '1080p_ultra': 116.1,
      '1440p_ultra': 92.7,
      '4k_ultra': 51.5
    },
    raytracing: {
      '1080p_medium': 68.4,
      '1080p_ultra': 49.7,
      '1440p_ultra': 31.8,
      '4k_ultra': 15.2
    }
  },
  {
    name: "Radeon RX 6800",
    tdp: 250,
    raster: {
      '1080p_medium': 168.7,
      '1080p_ultra': 114.6,
      '1440p_ultra': 89.2,
      '4k_ultra': 50.7
    },
    raytracing: {
      '1080p_medium': 60.1,
      '1080p_ultra': 41.2,
      '1440p_ultra': 26.3,
      '4k_ultra': null
    }
  },
  {
    name: "GeForce RTX 3070 Ti",
      tdp: 290,
    raster: {
      '1080p_medium': 159.8,
      '1080p_ultra': 104.0,
      '1440p_ultra': 82.8,
      '4k_ultra': 47.7
    },
    raytracing: {
      '1080p_medium': 84.0,
      '1080p_ultra': 58.6,
      '1440p_ultra': 37.1,
      '4k_ultra': null
    }
  },
  {
    name: "Radeon RX 6750 XT",
    tdp: 250,
    raster: {
      '1080p_medium': 161.6,
      '1080p_ultra': 102.9,
      '1440p_ultra': 77.2,
      '4k_ultra': 42.8
    },
    raytracing: {
      '1080p_medium': 49.8,
      '1080p_ultra': 34.5,
      '1440p_ultra': 21.5,
      '4k_ultra': null
    }
  },
  {
    name: "GeForce RTX 4060 Ti 16GB",
    tdp: 165,
    raster: {
      '1080p_medium': 161.7,
      '1080p_ultra': 100.6,
      '1440p_ultra': 75.7,
      '4k_ultra': 41.6
    },
    raytracing: {
      '1080p_medium': 75.0,
      '1080p_ultra': 53.0,
      '1440p_ultra': 34.0,
      '4k_ultra': 16.5
    }
  },
  {
    name: "GeForce RTX 4060 Ti",
    tdp: 160,
    raster: {
      '1080p_medium': 160.1,
      '1080p_ultra': 100.4,
      '1440p_ultra': 75.6,
      '4k_ultra': 39.6
    },
    raytracing: {
      '1080p_medium': 75.1,
      '1080p_ultra': 52.8,
      '1440p_ultra': 33.5,
      '4k_ultra': 13.9
    }
  },
  {
    name: "Titan RTX",
    tdp: 280,
    raster: {
      '1080p_medium': 156.6,
      '1080p_ultra': 99.3,
      '1440p_ultra': 79.5,
      '4k_ultra': 47.8
    },
    raytracing: {
      '1080p_medium': 74.4,
      '1080p_ultra': 53.3,
      '1440p_ultra': 35.0,
      '4k_ultra': 17.4
    }
  },
  {
    name: "Radeon RX 6700 XT",
    tdp: 230,
    raster: {
      '1080p_medium': 158.1,
      '1080p_ultra': 99.1,
      '1440p_ultra': 73.4,
      '4k_ultra': 40.4
    },
    raytracing: {
      '1080p_medium': 46.6,
      '1080p_ultra': 32.3,
      '1440p_ultra': 19.9,
      '4k_ultra': null
    }
  },
  {
    name: "GeForce RTX 3070",
    tdp: 220,
    raster: {
      '1080p_medium': 154.8,
      '1080p_ultra': 98.8,
      '1440p_ultra': 77.7,
      '4k_ultra': 44.4
    },
    raytracing: {
      '1080p_medium': 78.2,
      '1080p_ultra': 54.4,
      '1440p_ultra': 34.1,
      '4k_ultra': null
    }
  },
  {
    name: "GeForce RTX 2080 Ti",
    tdp: 250,
    raster: {
      '1080p_medium': 151.0,
      '1080p_ultra': 96.3,
      '1440p_ultra': 75.6,
      '4k_ultra': 43.5
    },
    raytracing: {
      '1080p_medium': 70.9,
      '1080p_ultra': 50.7,
      '1440p_ultra': 32.9,
      '4k_ultra': null
    }
  },
  {
    name: "Radeon RX 7600 XT",
    tdp: 190,
    raster: {
      '1080p_medium': 151.2,
      '1080p_ultra': 91.9,
      '1440p_ultra': 65.9,
      '4k_ultra': 37.1
    },
    raytracing: {
      '1080p_medium': 44.2,
      '1080p_ultra': 30.8,
      '1440p_ultra': 19.0,
      '4k_ultra': 8.9
    }
  },
  {
    name: "GeForce RTX 3060 Ti",
      tdp: 200,
    raster: {
      '1080p_medium': 146.9,
      '1080p_ultra': 90.7,
      '1440p_ultra': 70.0,
      '4k_ultra': null
    },
    raytracing: {
      '1080p_medium': 69.5,
      '1080p_ultra': 47.7,
      '1440p_ultra': 30.0,
      '4k_ultra': null
    }
  },
  {
    name: "Radeon RX 6700 10GB",
    tdp: 175,
    raster: {
      '1080p_medium': 145.7,
      '1080p_ultra': 86.1,
      '1440p_ultra': 62.8,
      '4k_ultra': 32.9
    },
    raytracing: {
      '1080p_medium': 42.9,
      '1080p_ultra': 29.2,
      '1440p_ultra': 17.5,
      '4k_ultra': null
    }
  },
  {
    name: "GeForce RTX 2080 Super",
    tdp: 250,
    raster: {
      '1080p_medium': 141.3,
      '1080p_ultra': 86.0,
      '1440p_ultra': 66.1,
      '4k_ultra': 36.7
    },
    raytracing: {
      '1080p_medium': 59.4,
      '1080p_ultra': 42.0,
      '1440p_ultra': 27.1,
      '4k_ultra': null
    }
  },
  {
    name: "GeForce RTX 4060",
    tdp: 115,
    raster: {
      '1080p_medium': 142.3,
      '1080p_ultra': 84.9,
      '1440p_ultra': 61.2,
      '4k_ultra': 31.9
    },
    raytracing: {
      '1080p_medium': 58.8,
      '1080p_ultra': 41.7,
      '1440p_ultra': 25.8,
      '4k_ultra': null
    }
  },
  {
    name: "GeForce RTX 2080",
    tdp: 215,
    raster: {
      '1080p_medium': 136.7,
      '1080p_ultra': 82.5,
      '1440p_ultra': 63.2,
      '4k_ultra': null
    },
    raytracing: {
      '1080p_medium': 57.1,
      '1080p_ultra': 39.7,
      '1440p_ultra': 25.5,
      '4k_ultra': null
    }
  },
  {
    name: "Radeon RX 7600",
    tdp: 165,
    raster: {
      '1080p_medium': 141.4,
      '1080p_ultra': 82.0,
      '1440p_ultra': 57.3,
      '4k_ultra': 29.1
    },
    raytracing: {
      '1080p_medium': 38.3,
      '1080p_ultra': 25.7,
      '1440p_ultra': 15.2,
      '4k_ultra': null
    }
  },
  {
    name: "Radeon RX 6650 XT",
    tdp: 176,
    raster: {
      '1080p_medium': 137.1,
      '1080p_ultra': 77.7,
      '1440p_ultra': 54.5,
      '4k_ultra': null
    },
    raytracing: {
      '1080p_medium': 37.6,
      '1080p_ultra': 25.6,
      '1440p_ultra': null,
      '4k_ultra': null
    }
  },
  {
    name: "GeForce RTX 2070 Super",
    tdp: 215,
    raster: {
      '1080p_medium': 129.6,
      '1080p_ultra': 77.4,
      '1440p_ultra': 58.4,
      '4k_ultra': null
    },
    raytracing: {
      '1080p_medium': 52.4,
      '1080p_ultra': 36.6,
      '1440p_ultra': 23.1,
      '4k_ultra': null
    }
  },
  {
    name: "Intel Arc A770 16GB",
      tdp: 225,
    raster: {
      '1080p_medium': 116.4,
      '1080p_ultra': 76.9,
      '1440p_ultra': 59.8,
      '4k_ultra': 35.3
    },
    raytracing: {
      '1080p_medium': 54.1,
      '1080p_ultra': 38.6,
      '1440p_ultra': 26.2,
      '4k_ultra': null
    }
  },
  {
    name: "Intel Arc A770 8GB",
      tdp: 225,
    raster: {
      '1080p_medium': 115.5,
      '1080p_ultra': 75.3,
      '1440p_ultra': 57.5,
      '4k_ultra': 33.2
    },
    raytracing: {
      '1080p_medium': 54.2,
      '1080p_ultra': 38.7,
      '1440p_ultra': 24.9,
      '4k_ultra': null
    }
  },
  {
    name: "Radeon RX 6600 XT",
    tdp: 160,
    raster: {
      '1080p_medium': 133.5,
      '1080p_ultra': 74.7,
      '1440p_ultra': 52.2,
      '4k_ultra': null
    },
    raytracing: {
      '1080p_medium': 36.7,
      '1080p_ultra': 24.8,
      '1440p_ultra': null,
      '4k_ultra': null
    }
  },
  {
    name: "Radeon RX 5700 XT",
    tdp: 225,
    raster: {
      '1080p_medium': 124.9,
      '1080p_ultra': 73.3,
      '1440p_ultra': 53.1,
      '4k_ultra': 29.3
    },
    raytracing: {
      '1080p_medium': null,
      '1080p_ultra': null,
      '1440p_ultra': null,
      '4k_ultra': null
    }
  },
  {
    name: "GeForce RTX 3060",
    tdp: 170,
    raster: {
      '1080p_medium': 121.0,
      '1080p_ultra': 72.3,
      '1440p_ultra': 54.0,
      '4k_ultra': null
    },
    raytracing: {
      '1080p_medium': 52.5,
      '1080p_ultra': 35.1,
      '1440p_ultra': 22.0,
      '4k_ultra': null
    }
  },
  {
    name: "Intel Arc A750",
    tdp: 225,
    raster: {
      '1080p_medium': 110.4,
      '1080p_ultra': 70.8,
      '1440p_ultra': 53.7,
      '4k_ultra': 31.1
    },
    raytracing: {
      '1080p_medium': 51.0,
      '1080p_ultra': 36.6,
      '1440p_ultra': 23.5,
      '4k_ultra': null
    }
  },
  {
    name: "GeForce RTX 2070",
    tdp: 175,
    raster: {
      '1080p_medium': 119.1,
      '1080p_ultra': 69.8,
      '1440p_ultra': 51.8,
      '4k_ultra': null
    },
    raytracing: {
      '1080p_medium': 46.3,
      '1080p_ultra': 32.1,
      '1440p_ultra': 20.4,
      '4k_ultra': null
    }
  },
  {
    name: "Radeon VII",
    tdp: 300,
    raster: {
      '1080p_medium': 113.9,
      '1080p_ultra': 69.5,
      '1440p_ultra': 53.0,
      '4k_ultra': 31.5
    },
    raytracing: {
      '1080p_medium': null,
      '1080p_ultra': null,
      '1440p_ultra': null,
      '4k_ultra': null
    }
  },
  {
    name: "GeForce GTX 1080 Ti",
    tdp: 250,
    raster: {
      '1080p_medium': 110.2,
      '1080p_ultra': 66.4,
      '1440p_ultra': 50.2,
      '4k_ultra': 29.5
    },
    raytracing: {
      '1080p_medium': null,
      '1080p_ultra': null,
      '1440p_ultra': null,
      '4k_ultra': null
    }
  },
  {
    name: "GeForce RTX 2060 Super",
    tdp: 175,
    raster: {
      '1080p_medium': 112.0,
      '1080p_ultra': 65.5,
      '1440p_ultra': 48.3,
      '4k_ultra': null
    },
    raytracing: {
      '1080p_medium': 44.5,
      '1080p_ultra': 30.5,
      '1440p_ultra': 19.3,
      '4k_ultra': null
    }
  },
  {
    name: "Radeon RX 6600",
    tdp: 132,
    raster: {
      '1080p_medium': 116.2,
      '1080p_ultra': 65.2,
      '1440p_ultra': 44.8,
      '4k_ultra': null
    },
    raytracing: {
      '1080p_medium': 30.8,
      '1080p_ultra': 20.7,
      '1440p_ultra': null,
      '4k_ultra': null
    }
  },
  {
    name: "Intel Arc A580",
    tdp: 185,
    raster: {
      '1080p_medium': 101.1,
      '1080p_ultra': 65.1,
      '1440p_ultra': 48.8,
      '4k_ultra': 27.9
    },
    raytracing: {
      '1080p_medium': 45.6,
      '1080p_ultra': 32.7,
      '1440p_ultra': 21.1,
      '4k_ultra': null
    }
  },
  {
    name: "Radeon RX 5700",
    tdp: 180,
    raster: {
      '1080p_medium': 110.8,
      '1080p_ultra': 64.5,
      '1440p_ultra': 46.7,
      '4k_ultra': null
    },
    raytracing: {
      '1080p_medium': null,
      '1080p_ultra': null,
      '1440p_ultra': null,
      '4k_ultra': null
    }
  },
  {
    name: "Radeon RX 5600 XT",
      tdp: 150,
    raster: {
      '1080p_medium': 100.0,
      '1080p_ultra': 57.8,
      '1440p_ultra': 42.0,
      '4k_ultra': null
    },
    raytracing: {
      '1080p_medium': null,
      '1080p_ultra': null,
      '1440p_ultra': null,
      '4k_ultra': null
    }
  },
  {
    name: "Radeon RX Vega 64",
    tdp: 295,
    raster: {
      '1080p_medium': 94.3,
      '1080p_ultra': 56.7,
      '1440p_ultra': 41.6,
      '4k_ultra': 23.5
    },
    raytracing: {
      '1080p_medium': null,
      '1080p_ultra': null,
      '1440p_ultra': null,
      '4k_ultra': null
    }
  },
  {
    name: "GeForce RTX 2060",
    tdp: 160,
    raster: {
      '1080p_medium': 100.5,
      '1080p_ultra': 55.5,
      '1440p_ultra': 40.1,
      '4k_ultra': null
    },
    raytracing: {
      '1080p_medium': 38.4,
      '1080p_ultra': 25.4,
      '1440p_ultra': null,
      '4k_ultra': null
    }
  },
  {
    name: "GeForce GTX 1080",
    tdp: 180,
    raster: {
      '1080p_medium': 89.9,
      '1080p_ultra': 53.0,
      '1440p_ultra': 39.4,
      '4k_ultra': null
    },
    raytracing: {
      '1080p_medium': null,
      '1080p_ultra': null,
      '1440p_ultra': null,
      '4k_ultra': null
    }
  },
  {
    name: "GeForce RTX 3050",
    tdp: 130,
    raster: {
      '1080p_medium': 88.8,
      '1080p_ultra': 51.9,
      '1440p_ultra': 38.5,
      '4k_ultra': null
    },
    raytracing: {
      '1080p_medium': 36.9,
      '1080p_ultra': 24.6,
      '1440p_ultra': null,
      '4k_ultra': null
    }
  },
  {
    name: "GeForce GTX 1070 Ti",
      tdp: 180,
    raster: {
      '1080p_medium': 85.7,
      '1080p_ultra': 51.1,
      '1440p_ultra': 37.9,
      '4k_ultra': null
    },
    raytracing: {
      '1080p_medium': null,
      '1080p_ultra': null,
      '1440p_ultra': null,
      '4k_ultra': null
    }
  },
  {
    name: "Radeon RX Vega 56",
    tdp: 210,
    raster: {
      '1080p_medium': 84.2,
      '1080p_ultra': 50.6,
      '1440p_ultra': 37.0,
      '4k_ultra': null
    },
    raytracing: {
      '1080p_medium': null,
      '1080p_ultra': null,
      '1440p_ultra': null,
      '4k_ultra': null
    }
  },
  {
    name: "GeForce GTX 1660 Super",
    tdp: 125,
    raster: {
      '1080p_medium': 85.5,
      '1080p_ultra': 46.8,
      '1440p_ultra': 33.3,
      '4k_ultra': null
    },
    raytracing: {
      '1080p_medium': null,
      '1080p_ultra': null,
      '1440p_ultra': null,
      '4k_ultra': null
    }
  },
  {
    name: "GeForce GTX 1660 Ti",
      tdp: 120,
    raster: {
      '1080p_medium': 84.8,
      '1080p_ultra': 46.6,
      '1440p_ultra': 33.3,
      '4k_ultra': null
    },
    raytracing: {
      '1080p_medium': null,
      '1080p_ultra': null,
      '1440p_ultra': null,
      '4k_ultra': null
    }
  },
  {
    name: "GeForce GTX 1070",
      tdp: 150,
    raster: {
      '1080p_medium': 75.0,
      '1080p_ultra': 44.7,
      '1440p_ultra': 33.1,
      '4k_ultra': null
    },
    raytracing: {
      '1080p_medium': null,
      '1080p_ultra': null,
      '1440p_ultra': null,
      '4k_ultra': null
    }
  },
  {
    name: "GeForce GTX 1660",
    tdp: 120,
    raster: {
      '1080p_medium': 77.8,
      '1080p_ultra': 42.6,
      '1440p_ultra': 30.3,
      '4k_ultra': null
    },
    raytracing: {
      '1080p_medium': null,
      '1080p_ultra': null,
      '1440p_ultra': null,
      '4k_ultra': null
    }
  },
  {
    name: "Radeon RX 5500 XT 8GB",
    tdp: 130,
    raster: {
      '1080p_medium': 72.1,
      '1080p_ultra': 39.7,
      '1440p_ultra': 28.2,
      '4k_ultra': null
    },
    raytracing: {
      '1080p_medium': null,
      '1080p_ultra': null,
      '1440p_ultra': null,
      '4k_ultra': null
    }
  },
  {
    name: "Radeon RX 590",
    tdp: 175,
    raster: {
      '1080p_medium': 68.5,
      '1080p_ultra': 39.3,
      '1440p_ultra': 29.0,
      '4k_ultra': null
    },
    raytracing: {
      '1080p_medium': null,
      '1080p_ultra': null,
      '1440p_ultra': null,
      '4k_ultra': null
    }
  },
  {
    name: "GeForce GTX 980 Ti",
    tdp: 250,
    raster: {
      '1080p_medium': 62.6,
      '1080p_ultra': 35.9,
      '1440p_ultra': 26.6,
      '4k_ultra': null
    },
    raytracing: {
      '1080p_medium': null,
      '1080p_ultra': null,
      '1440p_ultra': null,
      '4k_ultra': null
    }
  },
  {
    name: "Radeon RX 580 8GB",
    tdp: 185,
    raster: {
      '1080p_medium': 61.7,
      '1080p_ultra': 35.3,
      '1440p_ultra': 26.0,
      '4k_ultra': null
    },
    raytracing: {
      '1080p_medium': null,
      '1080p_ultra': null,
      '1440p_ultra': null,
      '4k_ultra': null
    }
  },
  {
    name: "Radeon R9 Fury X",
    tdp: 275,
    raster: {
      '1080p_medium': 63.8,
      '1080p_ultra': 35.2,
      '1440p_ultra': null,
      '4k_ultra': null
    },
    raytracing: {
      '1080p_medium': null,
      '1080p_ultra': null,
      '1440p_ultra': null,
      '4k_ultra': null
    }
  },
  {
    name: "GeForce GTX 1650 Super",
    tdp: 100,
    raster: {
      '1080p_medium': 67.7,
      '1080p_ultra': 33.9,
      '1440p_ultra': 21.2,
      '4k_ultra': null
    },
    raytracing: {
      '1080p_medium': null,
      '1080p_ultra': null,
      '1440p_ultra': null,
      '4k_ultra': null
    }
  },
  {
    name: "Radeon RX 5500 XT 4GB",
    tdp: 130,
    raster: {
      '1080p_medium': 66.8,
      '1080p_ultra': 33.3,
      '1440p_ultra': null,
      '4k_ultra': null
    },
    raytracing: {
      '1080p_medium': null,
      '1080p_ultra': null,
      '1440p_ultra': null,
      '4k_ultra': null
    }
  },
  {
    name: "GeForce GTX 1060 6GB",
    tdp: 120,
    raster: {
      '1080p_medium': 57.7,
      '1080p_ultra': 32.1,
      '1440p_ultra': 23.0,
      '4k_ultra': null
    },
    raytracing: {
      '1080p_medium': null,
      '1080p_ultra': null,
      '1440p_ultra': null,
      '4k_ultra': null
    }
  },
  {
    name: "Radeon RX 6500 XT",
    tdp: 107,
    raster: {
      '1080p_medium': 65.8,
      '1080p_ultra': 30.6,
      '1440p_ultra': 18.0,
      '4k_ultra': null
    },
    raytracing: {
      '1080p_medium': 9.9,
      '1080p_ultra': null,
      '1440p_ultra': null,
      '4k_ultra': null
    }
  },
  {
    name: "Radeon R9 390",
    tdp: 275,
    raster: {
      '1080p_medium': 51.1,
      '1080p_ultra': 29.8,
      '1440p_ultra': null,
      '4k_ultra': null
    },
    raytracing: {
      '1080p_medium': null,
      '1080p_ultra': null,
      '1440p_ultra': null,
      '4k_ultra': null
    }
  },
  {
    name: "GeForce GTX 980",
      tdp: 165,
    raster: {
      '1080p_medium': 53.6,
      '1080p_ultra': 28.9,
      '1440p_ultra': null,
      '4k_ultra': null
    },
    raytracing: {
      '1080p_medium': null,
      '1080p_ultra': null,
      '1440p_ultra': null,
      '4k_ultra': null
    }
  },
  {
    name: "GeForce GTX 1650 GDDR6",
    tdp: 75,
    raster: {
      '1080p_medium': 56.6,
      '1080p_ultra': 28.8,
      '1440p_ultra': null,
      '4k_ultra': null
    },
    raytracing: {
      '1080p_medium': null,
      '1080p_ultra': null,
      '1440p_ultra': null,
      '4k_ultra': null
    }
  },
  {
    name: "Intel Arc A380",
    tdp: 75,
    raster: {
      '1080p_medium': 54.3,
      '1080p_ultra': 28.4,
      '1440p_ultra': null,
      '4k_ultra': null
    },
    raytracing: {
      '1080p_medium': 18.3,
      '1080p_ultra': null,
      '1440p_ultra': null,
      '4k_ultra': null
    }
  },
  {
    name: "Radeon RX 570 4GB",
    tdp: 150,
    raster: {
      '1080p_medium': 53.6,
      '1080p_ultra': 28.1,
      '1440p_ultra': 19.9,
      '4k_ultra': null
    },
    raytracing: {
      '1080p_medium': null,
      '1080p_ultra': null,
      '1440p_ultra': null,
      '4k_ultra': null
    }
  },
  {
    name: "GeForce GTX 1650",
    tdp: 75,
    raster: {
      '1080p_medium': 51.3,
      '1080p_ultra': 27.0,
      '1440p_ultra': null,
      '4k_ultra': null
    },
    raytracing: {
      '1080p_medium': null,
      '1080p_ultra': null,
      '1440p_ultra': null,
      '4k_ultra': null
    }
  },
  {
    name: "GeForce GTX 970",
    tdp: 145,
    raster: {
      '1080p_medium': 49.0,
      '1080p_ultra': 26.5,
      '1440p_ultra': null,
      '4k_ultra': null
    },
    raytracing: {
      '1080p_medium': null,
      '1080p_ultra': null,
      '1440p_ultra': null,
      '4k_ultra': null
    }
  },
  {
    name: "Radeon RX 6400",
    tdp: 53,
    raster: {
      '1080p_medium': 51.1,
      '1080p_ultra': 24.1,
      '1440p_ultra': null,
      '4k_ultra': null
    },
    raytracing: {
      '1080p_medium': 8.3,
      '1080p_ultra': null,
      '1440p_ultra': null,
      '4k_ultra': null
    }
  },
  {
    name: "GeForce GTX 1050 Ti",
    tdp: 75,
    raster: {
      '1080p_medium': 38.0,
      '1080p_ultra': 19.8,
      '1440p_ultra': null,
      '4k_ultra': null
    },
    raytracing: {
      '1080p_medium': null,
      '1080p_ultra': null,
      '1440p_ultra': null,
      '4k_ultra': null
    }
  },
  {
    name: "GeForce GTX 1060 3GB",
    tdp: 120,
    raster: {
      '1080p_medium': 52.5,
      '1080p_ultra': null,
      '1440p_ultra': null,
      '4k_ultra': null
    },
    raytracing: {
      '1080p_medium': null,
      '1080p_ultra': null,
      '1440p_ultra': null,
      '4k_ultra': null
    }
  },
  {
    name: "GeForce GTX 1630",
    tdp: 75,
    raster: {
      '1080p_medium': 33.8,
      '1080p_ultra': 16.9,
      '1440p_ultra': null,
      '4k_ultra': null
    },
    raytracing: {
      '1080p_medium': null,
      '1080p_ultra': null,
      '1440p_ultra': null,
      '4k_ultra': null
    }
  },
  {
    name: "Radeon RX 560 4GB",
    tdp: 80,
    raster: {
      '1080p_medium': 31.7,
      '1080p_ultra': 14.7,
      '1440p_ultra': null,
      '4k_ultra': null
    },
    raytracing: {
      '1080p_medium': null,
      '1080p_ultra': null,
      '1440p_ultra': null,
      '4k_ultra': null
    }
  },
  {
    name: "GeForce GTX 1050",
    tdp: 75,
    raster: {
      '1080p_medium': 29.7,
      '1080p_ultra': null,
      '1440p_ultra': null,
      '4k_ultra': null
    },
    raytracing: {
      '1080p_medium': null,
      '1080p_ultra': null,
      '1440p_ultra': null,
      '4k_ultra': null
    }
  },
  {
    name: "Radeon RX 550 4GB",
    tdp: 50,
    raster: {
      '1080p_medium': 31.7,
      '1080p_ultra': null,
      '1440p_ultra': null,
      '4k_ultra': null
    },
    raytracing: {
      '1080p_medium': null,
      '1080p_ultra': null,
      '1440p_ultra': null,
      '4k_ultra': null
    }
  },
  {
    name: "GeForce GT 1030",
    tdp: 30,
    raster: {
      '1080p_medium': 14.6,
      '1080p_ultra': null,
      '1440p_ultra': null,
      '4k_ultra': null
    },
    raytracing: {
      '1080p_medium': null,
      '1080p_ultra': null,
      '1440p_ultra': null,
      '4k_ultra': null
    }
    }
];