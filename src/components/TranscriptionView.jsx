import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Copy,
  Check,
  Save,
  Upload,
  FolderOpen,
  AlertCircle,
  CheckCircle2,
  Clock,
  Key,
  Eye,
  EyeOff,
  Volume2,
  FileCode,
  FileText,
  Wand2,
  RefreshCw,
  Code2,
  Sliders,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

export const SAMPLE_BERMUDA_TRANSCRIPT = {
  "duration": 45.84,
  "sentences": [
    {
      "id": "s0",
      "text": "The Bermuda Triangle is one of the world's most famous mysteries.",
      "start": 0.29,
      "end": 5.51,
      "words": [
        {
          "id": "w0",
          "text": "The",
          "start": 0.29,
          "end": 0.33
        },
        {
          "id": "w1",
          "text": "Bermuda",
          "start": 0.33,
          "end": 0.96
        },
        {
          "id": "w2",
          "text": "Triangle",
          "start": 0.96,
          "end": 1.72
        },
        {
          "id": "w3",
          "text": "is",
          "start": 1.73,
          "end": 1.92
        },
        {
          "id": "w4",
          "text": "one",
          "start": 1.92,
          "end": 2.21
        },
        {
          "id": "w5",
          "text": "of",
          "start": 2.21,
          "end": 2.4
        },
        {
          "id": "w6",
          "text": "the",
          "start": 2.4,
          "end": 2.69
        },
        {
          "id": "w7",
          "text": "world's",
          "start": 2.69,
          "end": 3.36
        },
        {
          "id": "w8",
          "text": "most",
          "start": 3.36,
          "end": 3.74
        },
        {
          "id": "w9",
          "text": "famous",
          "start": 3.74,
          "end": 4.32
        },
        {
          "id": "w10",
          "text": "mysteries.",
          "start": 4.32,
          "end": 5.51
        }
      ]
    },
    {
      "id": "s1",
      "text": "Located between Florida, Bermuda, and Puerto Rico, it has been linked to stories of ships and planes mysteriously disappearing.",
      "start": 5.85,
      "end": 14.12,
      "words": [
        {
          "id": "w11",
          "text": "Located",
          "start": 5.85,
          "end": 5.93
        },
        {
          "id": "w12",
          "text": "between",
          "start": 5.93,
          "end": 6.34
        },
        {
          "id": "w13",
          "text": "Florida,",
          "start": 6.34,
          "end": 6.84
        },
        {
          "id": "w14",
          "text": "Bermuda,",
          "start": 6.86,
          "end": 7.38
        },
        {
          "id": "w15",
          "text": "and",
          "start": 7.38,
          "end": 7.54
        },
        {
          "id": "w16",
          "text": "Puerto",
          "start": 7.55,
          "end": 7.9
        },
        {
          "id": "w17",
          "text": "Rico,",
          "start": 7.9,
          "end": 8.31
        },
        {
          "id": "w18",
          "text": "it",
          "start": 8.32,
          "end": 8.47
        },
        {
          "id": "w19",
          "text": "has",
          "start": 8.47,
          "end": 8.69
        },
        {
          "id": "w20",
          "text": "been",
          "start": 8.69,
          "end": 8.98
        },
        {
          "id": "w21",
          "text": "linked",
          "start": 8.98,
          "end": 9.42
        },
        {
          "id": "w22",
          "text": "to",
          "start": 9.42,
          "end": 9.57
        },
        {
          "id": "w23",
          "text": "stories",
          "start": 9.57,
          "end": 9.86
        },
        {
          "id": "w24",
          "text": "of",
          "start": 9.91,
          "end": 10.22
        },
        {
          "id": "w25",
          "text": "ships",
          "start": 10.55,
          "end": 10.64
        },
        {
          "id": "w26",
          "text": "and",
          "start": 10.64,
          "end": 10.97
        },
        {
          "id": "w27",
          "text": "planes",
          "start": 10.97,
          "end": 11.48
        },
        {
          "id": "w28",
          "text": "mysteriously",
          "start": 11.53,
          "end": 12.66
        },
        {
          "id": "w29",
          "text": "disappearing.",
          "start": 12.66,
          "end": 14.12
        }
      ]
    },
    {
      "id": "s2",
      "text": "One of the most famous cases happened in 1945, when five US Navy aircraft vanished during a training mission.",
      "start": 14.12,
      "end": 22.82,
      "words": [
        {
          "id": "w30",
          "text": "One",
          "start": 14.12,
          "end": 14.45
        },
        {
          "id": "w31",
          "text": "of",
          "start": 14.45,
          "end": 14.52
        },
        {
          "id": "w32",
          "text": "the",
          "start": 14.52,
          "end": 14.76
        },
        {
          "id": "w33",
          "text": "most",
          "start": 14.76,
          "end": 15.08
        },
        {
          "id": "w34",
          "text": "famous",
          "start": 15.08,
          "end": 15.56
        },
        {
          "id": "w35",
          "text": "cases",
          "start": 15.56,
          "end": 15.96
        },
        {
          "id": "w36",
          "text": "happened",
          "start": 15.96,
          "end": 16.6
        },
        {
          "id": "w37",
          "text": "in",
          "start": 16.6,
          "end": 16.76
        },
        {
          "id": "w38",
          "text": "1945,",
          "start": 16.76,
          "end": 17.87
        },
        {
          "id": "w39",
          "text": "when",
          "start": 17.88,
          "end": 18.2
        },
        {
          "id": "w40",
          "text": "five",
          "start": 18.2,
          "end": 18.46
        },
        {
          "id": "w41",
          "text": "US",
          "start": 18.46,
          "end": 18.68
        },
        {
          "id": "w42",
          "text": "Navy",
          "start": 18.68,
          "end": 18.98
        },
        {
          "id": "w43",
          "text": "aircraft",
          "start": 19.15,
          "end": 19.64
        },
        {
          "id": "w44",
          "text": "vanished",
          "start": 19.64,
          "end": 20.28
        },
        {
          "id": "w45",
          "text": "during",
          "start": 20.28,
          "end": 20.62
        },
        {
          "id": "w46",
          "text": "a",
          "start": 20.79,
          "end": 20.87
        },
        {
          "id": "w47",
          "text": "training",
          "start": 21.11,
          "end": 21.58
        },
        {
          "id": "w48",
          "text": "mission.",
          "start": 21.58,
          "end": 22.27
        },
        {
          "id": "w49",
          "text": "But",
          "start": 22.81,
          "end": 22.82
        }
      ]
    },
    {
      "id": "s3",
      "text": "But is the area actually dangerous?",
      "start": 22.82,
      "end": 26.74,
      "words": [
        {
          "id": "w50",
          "text": "is",
          "start": 22.82,
          "end": 23.05
        },
        {
          "id": "w51",
          "text": "the",
          "start": 23.05,
          "end": 23.39
        },
        {
          "id": "w52",
          "text": "area",
          "start": 23.39,
          "end": 23.84
        },
        {
          "id": "w53",
          "text": "actually",
          "start": 23.84,
          "end": 24.74
        },
        {
          "id": "w54",
          "text": "dangerous?",
          "start": 24.8,
          "end": 26.2
        },
        {
          "id": "w55",
          "text": "Scientists",
          "start": 26.53,
          "end": 26.74
        }
      ]
    },
    {
      "id": "s4",
      "text": "Scientists have found no evidence that disappearances happen here more often than in other busy parts of the ocean.",
      "start": 26.74,
      "end": 32.7,
      "words": [
        {
          "id": "w56",
          "text": "have",
          "start": 26.74,
          "end": 26.95
        },
        {
          "id": "w57",
          "text": "found",
          "start": 26.95,
          "end": 27.19
        },
        {
          "id": "w58",
          "text": "no",
          "start": 27.22,
          "end": 27.32
        },
        {
          "id": "w59",
          "text": "evidence",
          "start": 27.32,
          "end": 27.68
        },
        {
          "id": "w60",
          "text": "that",
          "start": 27.91,
          "end": 27.96
        },
        {
          "id": "w61",
          "text": "disappearances",
          "start": 27.96,
          "end": 28.71
        },
        {
          "id": "w62",
          "text": "happen",
          "start": 28.71,
          "end": 29.03
        },
        {
          "id": "w63",
          "text": "here",
          "start": 29.03,
          "end": 29.23
        },
        {
          "id": "w64",
          "text": "more",
          "start": 29.23,
          "end": 29.37
        },
        {
          "id": "w65",
          "text": "often",
          "start": 29.55,
          "end": 29.72
        },
        {
          "id": "w66",
          "text": "than",
          "start": 29.72,
          "end": 29.93
        },
        {
          "id": "w67",
          "text": "in",
          "start": 29.93,
          "end": 30.03
        },
        {
          "id": "w68",
          "text": "other",
          "start": 30.03,
          "end": 30.29
        },
        {
          "id": "w69",
          "text": "busy",
          "start": 30.29,
          "end": 30.54
        },
        {
          "id": "w70",
          "text": "parts",
          "start": 30.93,
          "end": 31.05
        },
        {
          "id": "w71",
          "text": "of",
          "start": 31.09,
          "end": 31.24
        },
        {
          "id": "w72",
          "text": "the",
          "start": 31.24,
          "end": 31.52
        },
        {
          "id": "w73",
          "text": "ocean.",
          "start": 31.52,
          "end": 32.09
        },
        {
          "id": "w74",
          "text": "Strong",
          "start": 32.61,
          "end": 32.7
        }
      ]
    },
    {
      "id": "s5",
      "text": "Strong storms, unpredictable weather, and powerful currents may explain many of the incidents.",
      "start": 32.7,
      "end": 38.87,
      "words": [
        {
          "id": "w75",
          "text": "storms,",
          "start": 32.7,
          "end": 33.25
        },
        {
          "id": "w76",
          "text": "unpredictable",
          "start": 33.25,
          "end": 34.18
        },
        {
          "id": "w77",
          "text": "weather,",
          "start": 34.18,
          "end": 34.8
        },
        {
          "id": "w78",
          "text": "and",
          "start": 34.81,
          "end": 35.02
        },
        {
          "id": "w79",
          "text": "powerful",
          "start": 35.02,
          "end": 35.44
        },
        {
          "id": "w80",
          "text": "currents",
          "start": 35.63,
          "end": 36.16
        },
        {
          "id": "w81",
          "text": "may",
          "start": 36.16,
          "end": 36.37
        },
        {
          "id": "w82",
          "text": "explain",
          "start": 36.37,
          "end": 36.62
        },
        {
          "id": "w83",
          "text": "many",
          "start": 36.66,
          "end": 37.14
        },
        {
          "id": "w84",
          "text": "of",
          "start": 37.14,
          "end": 37.32
        },
        {
          "id": "w85",
          "text": "the",
          "start": 37.32,
          "end": 37.53
        },
        {
          "id": "w86",
          "text": "incidents.",
          "start": 37.89,
          "end": 38.55
        },
        {
          "id": "w87",
          "text": "So,",
          "start": 38.57,
          "end": 38.87
        }
      ]
    },
    {
      "id": "s6",
      "text": "So, there may be no supernatural mystery after all. Just a fascinating legend that refuses to disappear.",
      "start": 38.89,
      "end": 45.41,
      "words": [
        {
          "id": "w88",
          "text": "there",
          "start": 38.89,
          "end": 39.27
        },
        {
          "id": "w89",
          "text": "may",
          "start": 39.27,
          "end": 39.51
        },
        {
          "id": "w90",
          "text": "be",
          "start": 39.51,
          "end": 39.67
        },
        {
          "id": "w91",
          "text": "no",
          "start": 39.67,
          "end": 39.83
        },
        {
          "id": "w92",
          "text": "supernatural",
          "start": 39.83,
          "end": 40.78
        },
        {
          "id": "w93",
          "text": "mystery",
          "start": 40.78,
          "end": 41.32
        },
        {
          "id": "w94",
          "text": "after",
          "start": 41.33,
          "end": 41.66
        },
        {
          "id": "w95",
          "text": "all.",
          "start": 41.7,
          "end": 42.24
        },
        {
          "id": "w96",
          "text": "Just",
          "start": 42.24,
          "end": 42.57
        },
        {
          "id": "w97",
          "text": "a",
          "start": 42.57,
          "end": 42.59
        },
        {
          "id": "w98",
          "text": "fascinating",
          "start": 42.59,
          "end": 43.36
        },
        {
          "id": "w99",
          "text": "legend",
          "start": 43.36,
          "end": 43.72
        },
        {
          "id": "w100",
          "text": "that",
          "start": 43.95,
          "end": 44.06
        },
        {
          "id": "w101",
          "text": "refuses",
          "start": 44.06,
          "end": 44.49
        },
        {
          "id": "w102",
          "text": "to",
          "start": 44.56,
          "end": 44.68
        },
        {
          "id": "w103",
          "text": "disappear.",
          "start": 44.68,
          "end": 45.41
        }
      ]
    }
  ],
  "words": [
    {
      "id": "w0",
      "text": "The",
      "start": 0.29,
      "end": 0.33
    },
    {
      "id": "w1",
      "text": "Bermuda",
      "start": 0.33,
      "end": 0.96
    },
    {
      "id": "w2",
      "text": "Triangle",
      "start": 0.96,
      "end": 1.72
    },
    {
      "id": "w3",
      "text": "is",
      "start": 1.73,
      "end": 1.92
    },
    {
      "id": "w4",
      "text": "one",
      "start": 1.92,
      "end": 2.21
    },
    {
      "id": "w5",
      "text": "of",
      "start": 2.21,
      "end": 2.4
    },
    {
      "id": "w6",
      "text": "the",
      "start": 2.4,
      "end": 2.69
    },
    {
      "id": "w7",
      "text": "world's",
      "start": 2.69,
      "end": 3.36
    },
    {
      "id": "w8",
      "text": "most",
      "start": 3.36,
      "end": 3.74
    },
    {
      "id": "w9",
      "text": "famous",
      "start": 3.74,
      "end": 4.32
    },
    {
      "id": "w10",
      "text": "mysteries.",
      "start": 4.32,
      "end": 5.51
    },
    {
      "id": "w11",
      "text": "Located",
      "start": 5.85,
      "end": 5.93
    },
    {
      "id": "w12",
      "text": "between",
      "start": 5.93,
      "end": 6.34
    },
    {
      "id": "w13",
      "text": "Florida,",
      "start": 6.34,
      "end": 6.84
    },
    {
      "id": "w14",
      "text": "Bermuda,",
      "start": 6.86,
      "end": 7.38
    },
    {
      "id": "w15",
      "text": "and",
      "start": 7.38,
      "end": 7.54
    },
    {
      "id": "w16",
      "text": "Puerto",
      "start": 7.55,
      "end": 7.9
    },
    {
      "id": "w17",
      "text": "Rico,",
      "start": 7.9,
      "end": 8.31
    },
    {
      "id": "w18",
      "text": "it",
      "start": 8.32,
      "end": 8.47
    },
    {
      "id": "w19",
      "text": "has",
      "start": 8.47,
      "end": 8.69
    },
    {
      "id": "w20",
      "text": "been",
      "start": 8.69,
      "end": 8.98
    },
    {
      "id": "w21",
      "text": "linked",
      "start": 8.98,
      "end": 9.42
    },
    {
      "id": "w22",
      "text": "to",
      "start": 9.42,
      "end": 9.57
    },
    {
      "id": "w23",
      "text": "stories",
      "start": 9.57,
      "end": 9.86
    },
    {
      "id": "w24",
      "text": "of",
      "start": 9.91,
      "end": 10.22
    },
    {
      "id": "w25",
      "text": "ships",
      "start": 10.55,
      "end": 10.64
    },
    {
      "id": "w26",
      "text": "and",
      "start": 10.64,
      "end": 10.97
    },
    {
      "id": "w27",
      "text": "planes",
      "start": 10.97,
      "end": 11.48
    },
    {
      "id": "w28",
      "text": "mysteriously",
      "start": 11.53,
      "end": 12.66
    },
    {
      "id": "w29",
      "text": "disappearing.",
      "start": 12.66,
      "end": 14.12
    },
    {
      "id": "w30",
      "text": "One",
      "start": 14.12,
      "end": 14.45
    },
    {
      "id": "w31",
      "text": "of",
      "start": 14.45,
      "end": 14.52
    },
    {
      "id": "w32",
      "text": "the",
      "start": 14.52,
      "end": 14.76
    },
    {
      "id": "w33",
      "text": "most",
      "start": 14.76,
      "end": 15.08
    },
    {
      "id": "w34",
      "text": "famous",
      "start": 15.08,
      "end": 15.56
    },
    {
      "id": "w35",
      "text": "cases",
      "start": 15.56,
      "end": 15.96
    },
    {
      "id": "w36",
      "text": "happened",
      "start": 15.96,
      "end": 16.6
    },
    {
      "id": "w37",
      "text": "in",
      "start": 16.6,
      "end": 16.76
    },
    {
      "id": "w38",
      "text": "1945,",
      "start": 16.76,
      "end": 17.87
    },
    {
      "id": "w39",
      "text": "when",
      "start": 17.88,
      "end": 18.2
    },
    {
      "id": "w40",
      "text": "five",
      "start": 18.2,
      "end": 18.46
    },
    {
      "id": "w41",
      "text": "US",
      "start": 18.46,
      "end": 18.68
    },
    {
      "id": "w42",
      "text": "Navy",
      "start": 18.68,
      "end": 18.98
    },
    {
      "id": "w43",
      "text": "aircraft",
      "start": 19.15,
      "end": 19.64
    },
    {
      "id": "w44",
      "text": "vanished",
      "start": 19.64,
      "end": 20.28
    },
    {
      "id": "w45",
      "text": "during",
      "start": 20.28,
      "end": 20.62
    },
    {
      "id": "w46",
      "text": "a",
      "start": 20.79,
      "end": 20.87
    },
    {
      "id": "w47",
      "text": "training",
      "start": 21.11,
      "end": 21.58
    },
    {
      "id": "w48",
      "text": "mission.",
      "start": 21.58,
      "end": 22.27
    },
    {
      "id": "w49",
      "text": "But",
      "start": 22.81,
      "end": 22.82
    },
    {
      "id": "w50",
      "text": "is",
      "start": 22.82,
      "end": 23.05
    },
    {
      "id": "w51",
      "text": "the",
      "start": 23.05,
      "end": 23.39
    },
    {
      "id": "w52",
      "text": "area",
      "start": 23.39,
      "end": 23.84
    },
    {
      "id": "w53",
      "text": "actually",
      "start": 23.84,
      "end": 24.74
    },
    {
      "id": "w54",
      "text": "dangerous?",
      "start": 24.8,
      "end": 26.2
    },
    {
      "id": "w55",
      "text": "Scientists",
      "start": 26.53,
      "end": 26.74
    },
    {
      "id": "w56",
      "text": "have",
      "start": 26.74,
      "end": 26.95
    },
    {
      "id": "w57",
      "text": "found",
      "start": 26.95,
      "end": 27.19
    },
    {
      "id": "w58",
      "text": "no",
      "start": 27.22,
      "end": 27.32
    },
    {
      "id": "w59",
      "text": "evidence",
      "start": 27.32,
      "end": 27.68
    },
    {
      "id": "w60",
      "text": "that",
      "start": 27.91,
      "end": 27.96
    },
    {
      "id": "w61",
      "text": "disappearances",
      "start": 27.96,
      "end": 28.71
    },
    {
      "id": "w62",
      "text": "happen",
      "start": 28.71,
      "end": 29.03
    },
    {
      "id": "w63",
      "text": "here",
      "start": 29.03,
      "end": 29.23
    },
    {
      "id": "w64",
      "text": "more",
      "start": 29.23,
      "end": 29.37
    },
    {
      "id": "w65",
      "text": "often",
      "start": 29.55,
      "end": 29.72
    },
    {
      "id": "w66",
      "text": "than",
      "start": 29.72,
      "end": 29.93
    },
    {
      "id": "w67",
      "text": "in",
      "start": 29.93,
      "end": 30.03
    },
    {
      "id": "w68",
      "text": "other",
      "start": 30.03,
      "end": 30.29
    },
    {
      "id": "w69",
      "text": "busy",
      "start": 30.29,
      "end": 30.54
    },
    {
      "id": "w70",
      "text": "parts",
      "start": 30.93,
      "end": 31.05
    },
    {
      "id": "w71",
      "text": "of",
      "start": 31.09,
      "end": 31.24
    },
    {
      "id": "w72",
      "text": "the",
      "start": 31.24,
      "end": 31.52
    },
    {
      "id": "w73",
      "text": "ocean.",
      "start": 31.52,
      "end": 32.09
    },
    {
      "id": "w74",
      "text": "Strong",
      "start": 32.61,
      "end": 32.7
    },
    {
      "id": "w75",
      "text": "storms,",
      "start": 32.7,
      "end": 33.25
    },
    {
      "id": "w76",
      "text": "unpredictable",
      "start": 33.25,
      "end": 34.18
    },
    {
      "id": "w77",
      "text": "weather,",
      "start": 34.18,
      "end": 34.8
    },
    {
      "id": "w78",
      "text": "and",
      "start": 34.81,
      "end": 35.02
    },
    {
      "id": "w79",
      "text": "powerful",
      "start": 35.02,
      "end": 35.44
    },
    {
      "id": "w80",
      "text": "currents",
      "start": 35.63,
      "end": 36.16
    },
    {
      "id": "w81",
      "text": "may",
      "start": 36.16,
      "end": 36.37
    },
    {
      "id": "w82",
      "text": "explain",
      "start": 36.37,
      "end": 36.62
    },
    {
      "id": "w83",
      "text": "many",
      "start": 36.66,
      "end": 37.14
    },
    {
      "id": "w84",
      "text": "of",
      "start": 37.14,
      "end": 37.32
    },
    {
      "id": "w85",
      "text": "the",
      "start": 37.32,
      "end": 37.53
    },
    {
      "id": "w86",
      "text": "incidents.",
      "start": 37.89,
      "end": 38.55
    },
    {
      "id": "w87",
      "text": "So,",
      "start": 38.57,
      "end": 38.87
    },
    {
      "id": "w88",
      "text": "there",
      "start": 38.89,
      "end": 39.27
    },
    {
      "id": "w89",
      "text": "may",
      "start": 39.27,
      "end": 39.51
    },
    {
      "id": "w90",
      "text": "be",
      "start": 39.51,
      "end": 39.67
    },
    {
      "id": "w91",
      "text": "no",
      "start": 39.67,
      "end": 39.83
    },
    {
      "id": "w92",
      "text": "supernatural",
      "start": 39.83,
      "end": 40.78
    },
    {
      "id": "w93",
      "text": "mystery",
      "start": 40.78,
      "end": 41.32
    },
    {
      "id": "w94",
      "text": "after",
      "start": 41.33,
      "end": 41.66
    },
    {
      "id": "w95",
      "text": "all.",
      "start": 41.7,
      "end": 42.24
    },
    {
      "id": "w96",
      "text": "Just",
      "start": 42.24,
      "end": 42.57
    },
    {
      "id": "w97",
      "text": "a",
      "start": 42.57,
      "end": 42.59
    },
    {
      "id": "w98",
      "text": "fascinating",
      "start": 42.59,
      "end": 43.36
    },
    {
      "id": "w99",
      "text": "legend",
      "start": 43.36,
      "end": 43.72
    },
    {
      "id": "w100",
      "text": "that",
      "start": 43.95,
      "end": 44.06
    },
    {
      "id": "w101",
      "text": "refuses",
      "start": 44.06,
      "end": 44.49
    },
    {
      "id": "w102",
      "text": "to",
      "start": 44.56,
      "end": 44.68
    },
    {
      "id": "w103",
      "text": "disappear.",
      "start": 44.68,
      "end": 45.41
    }
  ]
};

export default function TranscriptionView({ projectId, projectTitle, onSwitchToCode, onOpenPromptHelper }) {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('gemini_api_key') || '');
  const [showApiKey, setShowApiKey] = useState(false);
  const [model, setModel] = useState('gemini-3.5-transcribe');
  const [customModel, setCustomModel] = useState('');
  const [audioAssets, setAudioAssets] = useState([]);
  const [selectedAudio, setSelectedAudio] = useState('');
  const [loadingAssets, setLoadingAssets] = useState(false);
  const [loadingBermuda, setLoadingBermuda] = useState(false);

  // Transcription state
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcribeProgress, setTranscribeProgress] = useState('');
  const [transcriptData, setTranscriptData] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [errorDetails, setErrorDetails] = useState(null);
  const [activeTab, setActiveTab] = useState('sentences'); // 'sentences', 'words', 'json', 'manual'

  // Manual editor state
  const [manualText, setManualText] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedKey, setCopiedKey] = useState(null);

  // Audio player & synchronized timestamp playback
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);

  // Snippet modal state
  const [showSnippetModal, setShowSnippetModal] = useState(false);
  const [generatedSnippet, setGeneratedSnippet] = useState('');

  // Persist API key to localStorage
  const handleApiKeyChange = (val) => {
    setApiKey(val);
    localStorage.setItem('gemini_api_key', val);
  };

  // Load project audio assets
  const fetchAssets = async () => {
    if (!projectId) return;
    setLoadingAssets(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/assets`);
      const data = await res.json();
      if (data.success && data.assets) {
        const audios = data.assets.filter((a) => a.type === 'audio');
        setAudioAssets(audios);
        if (audios.length > 0 && !selectedAudio) {
          setSelectedAudio(audios[0].name);
        }
      }
    } catch (err) {
      console.error('Failed to load project assets', err);
    } finally {
      setLoadingAssets(false);
    }
  };

  // Load existing transcript if saved in assets/transcript.json
  const fetchExistingTranscript = async () => {
    if (!projectId) return;
    try {
      const res = await fetch(`/api/projects/${projectId}/transcript`);
      const data = await res.json();
      if (data.success && data.exists && data.transcript) {
        setTranscriptData(data.transcript);
        setManualText(JSON.stringify(data.transcript, null, 2));
      }
    } catch (err) {
      console.error('Failed to fetch existing transcript', err);
    }
  };

  useEffect(() => {
    fetchAssets();
    fetchExistingTranscript();
  }, [projectId]);

  // Load Bermuda assets into project
  const handleLoadBermudaAssets = async () => {
    setLoadingBermuda(true);
    setErrorMessage(null);
    try {
      const res = await fetch(`/api/projects/${projectId}/load-bermuda-assets`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success) {
        await fetchAssets();
        setSelectedAudio('bermuda-voiceover.wav');
      } else {
        setErrorMessage(data.error || 'Failed to load Bermuda assets');
      }
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoadingBermuda(false);
    }
  };

  // Trigger Gemini Transcription API
  const handleGenerateTranscription = async () => {
    if (!apiKey.trim()) {
      setErrorMessage('Please enter your Gemini API Key in the field above.');
      return;
    }
    if (!selectedAudio) {
      setErrorMessage('Please select or upload an audio voiceover file first.');
      return;
    }

    setIsTranscribing(true);
    setErrorMessage(null);
    setErrorDetails(null);
    setTranscribeProgress('Encoding audio and sending to Gemini API...');

    const chosenModel = model === 'custom' ? customModel.trim() : model;

    try {
      const res = await fetch(`/api/projects/${projectId}/transcribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: selectedAudio,
          apiKey: apiKey.trim(),
          model: chosenModel,
        }),
      });

      const data = await res.json();
      if (data.success && data.transcript) {
        setTranscriptData(data.transcript);
        setManualText(JSON.stringify(data.transcript, null, 2));
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      } else {
        setErrorMessage(data.error || 'Transcription failed');
        setErrorDetails(data.details);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Network error communicating with server');
    } finally {
      setIsTranscribing(false);
      setTranscribeProgress('');
    }
  };

  // Save transcript manually
  const handleSaveTranscript = async (dataToSave = transcriptData) => {
    if (!dataToSave) return;
    try {
      const res = await fetch(`/api/projects/${projectId}/save-transcript`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: dataToSave }),
      });
      const data = await res.json();
      if (data.success) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 2500);
      } else {
        alert(data.error || 'Failed to save transcript');
      }
    } catch (err) {
      alert('Error saving transcript: ' + err.message);
    }
  };

  // Apply manual text JSON
  const handleApplyManualText = () => {
    try {
      const parsed = JSON.parse(manualText);
      setTranscriptData(parsed);
      handleSaveTranscript(parsed);
      setActiveTab('sentences');
    } catch (err) {
      alert('Invalid JSON: ' + err.message);
    }
  };

  // Load sample Bermuda transcript
  const handleLoadSampleTranscript = () => {
    setTranscriptData(SAMPLE_BERMUDA_TRANSCRIPT);
    setManualText(JSON.stringify(SAMPLE_BERMUDA_TRANSCRIPT, null, 2));
    handleSaveTranscript(SAMPLE_BERMUDA_TRANSCRIPT);
    setActiveTab('sentences');
  };

  // Audio player time updates
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setAudioDuration(audioRef.current.duration);
    }
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const seekAudio = (seconds) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, seconds);
      if (!isPlaying) {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    }
  };

  const handleRateChange = (rate) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  // Clipboard copy helper
  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Copy word timestamps JSON
  const copyWordTimestampsJson = () => {
    if (!transcriptData || !transcriptData.words) return;
    const jsonStr = JSON.stringify(transcriptData.words, null, 2);
    copyToClipboard(jsonStr, 'word-json');
  };

  // Copy formatted transcript for ChatGPT / Claude prompt
  const copyForPrompt = () => {
    if (!transcriptData) return;
    let md = `### Voiceover Transcription & Word Timestamps:\n\n`;
    md += `**Audio File**: \`assets/${selectedAudio || 'voiceover.wav'}\`\n`;
    md += `**Total Duration**: ${transcriptData.duration || audioDuration.toFixed(1)}s\n\n`;
    md += `**Sentence Subtitles**:\n`;
    (transcriptData.sentences || []).forEach((s) => {
      md += `- [${s.start.toFixed(2)}s - ${s.end.toFixed(2)}s]: "${s.text}"\n`;
    });
    md += `\n**Word-Level Timestamps (Canonical HyperFrames JSON)**:\n\`\`\`json\n`;
    md += JSON.stringify(transcriptData.words || [], null, 2);
    md += `\n\`\`\`\n`;
    md += `\n*Instruction*: Reveal visual scenes and sync kinetic typography highlights to these exact timestamps.\n`;
    copyToClipboard(md, 'prompt-md');
  };

  // Generate HyperFrames Captions HTML Snippet
  const generateCaptionsSnippet = () => {
    if (!transcriptData || !transcriptData.sentences) return;
    const sentences = transcriptData.sentences;
    let html = `<!-- HyperFrames Synchronized Captions & Audio Track -->\n`;
    html += `<audio id="voiceover" src="assets/${selectedAudio || 'voiceover.wav'}" data-start="0" data-duration="${transcriptData.duration || 10}" data-track-index="1" data-volume="1"></audio>\n\n`;
    html += `<!-- Subtitle Container (Overlay Track) -->\n`;
    html += `<div id="subtitles-track" style="position: absolute; bottom: 80px; left: 0; right: 0; display: flex; justify-content: center; pointer-events: none; z-index: 9999;">\n`;

    sentences.forEach((s, idx) => {
      html += `  <div id="sub-${s.id}" class="subtitle-card" style="opacity: 0; transform: translateY(12px); background: rgba(15,23,42,0.85); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.15); border-radius: 16px; padding: 14px 28px; max-width: 960px; text-align: center; font-size: 30px; font-weight: 700; color: #ffffff; box-shadow: 0 10px 30px rgba(0,0,0,0.6); position: absolute;">\n`;
      html += `    ${s.text}\n`;
      html += `  </div>\n`;
    });
    html += `</div>\n\n`;

    html += `<!-- In your GSAP Timeline: -->\n<script>\n`;
    sentences.forEach((s) => {
      const showDur = 0.35;
      const hideDur = 0.3;
      const stayDur = Math.max(0.1, s.end - s.start - showDur - hideDur);
      html += `  // Subtitle ${s.id} (${s.start}s -> ${s.end}s)\n`;
      html += `  tl.fromTo("#sub-${s.id}", { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: ${showDur}, ease: "power2.out" }, ${s.start});\n`;
      html += `  tl.to("#sub-${s.id}", { opacity: 0, y: -10, duration: ${hideDur}, ease: "power2.in" }, ${Math.max(s.start + showDur, s.end - hideDur)});\n\n`;
    });
    html += `</script>\n`;

    setGeneratedSnippet(html);
    setShowSnippetModal(true);
  };

  // Find active sentence and active word during audio playback
  const activeSentence = transcriptData?.sentences?.find(
    (s) => currentTime >= s.start && currentTime <= s.end
  );
  const activeWord = transcriptData?.words?.find(
    (w) => currentTime >= w.start && currentTime <= w.end
  );

  const formatSeconds = (sec) => {
    if (isNaN(sec)) return '00:00.00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    const ms = Math.floor((sec % 1) * 100);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  const audioUrl = selectedAudio ? `/preview/${projectId}/assets/${selectedAudio}` : '';

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 overflow-hidden">
      {/* Header Bar */}
      <div className="p-4 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0">
            <Mic className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-white">Speech-to-Text & Subtitles Studio</h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-950 text-indigo-300 border border-indigo-800/60">
                Word & Sentence Level Timestamps
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Transcribe audio voiceovers using Gemini or edit timestamps manually to synchronize HyperFrames animations
            </p>
          </div>
        </div>

        {/* Quick Example Assets Loader */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleLoadBermudaAssets}
            disabled={loadingBermuda}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-indigo-500/50 transition-all cursor-pointer"
            title="Load Bermuda voiceover and 3 scene images into this project"
          >
            <FolderOpen className="w-3.5 h-3.5 text-indigo-400" />
            <span>{loadingBermuda ? 'Loading Bermuda Assets...' : 'Load Bermuda Example Assets'}</span>
          </button>

          <button
            onClick={handleLoadSampleTranscript}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-950/60 hover:bg-indigo-900/60 text-indigo-300 border border-indigo-800/60 transition-all cursor-pointer"
            title="Pre-populate aligned Bermuda timestamps for testing without Gemini key"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Load Sample Bermuda Transcript</span>
          </button>
        </div>
      </div>

      {/* Configuration & Generator Controls */}
      <div className="p-4 bg-slate-900/90 border-b border-slate-800 grid grid-cols-1 md:grid-cols-12 gap-3 shrink-0">
        {/* Audio File Selector */}
        <div className="md:col-span-3 flex flex-col gap-1">
          <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Volume2 className="w-3 h-3 text-indigo-400" />
            Voiceover Audio File
          </label>
          <div className="flex items-center gap-2">
            <select
              value={selectedAudio}
              onChange={(e) => setSelectedAudio(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              {audioAssets.length === 0 && (
                <option value="">No audio file uploaded yet</option>
              )}
              {audioAssets.map((a) => (
                <option key={a.name} value={a.name}>
                  {a.name} ({((a.size || 0) / 1024 / 1024).toFixed(1)} MB)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Gemini API Key */}
        <div className="md:col-span-4 flex flex-col gap-1">
          <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Key className="w-3 h-3 text-indigo-400" />
              Gemini API Key
            </span>
            <span className="text-[10px] text-emerald-400 font-normal">Saved in browser</span>
          </label>
          <div className="relative">
            <input
              type={showApiKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => handleApiKeyChange(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-2.5 pr-8 py-1.5 text-xs text-white placeholder-slate-600 font-mono focus:outline-none focus:border-indigo-500"
            />
            <button
              type="button"
              onClick={() => setShowApiKey(!showApiKey)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              {showApiKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Gemini Model Selector */}
        <div className="md:col-span-3 flex flex-col gap-1">
          <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Sliders className="w-3 h-3 text-indigo-400" />
            Transcription Model
          </label>
          <div className="flex items-center gap-1.5">
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="gemini-3.5-transcribe">gemini-3.5-transcribe (Default)</option>
              <option value="gemini-2.5-flash">gemini-2.5-flash</option>
              <option value="gemini-1.5-flash">gemini-1.5-flash</option>
              <option value="gemini-1.5-pro">gemini-1.5-pro</option>
              <option value="custom">Custom Model Name...</option>
            </select>
            {model === 'custom' && (
              <input
                type="text"
                value={customModel}
                onChange={(e) => setCustomModel(e.target.value)}
                placeholder="model-id"
                className="w-32 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="md:col-span-2 flex flex-col justify-end">
          <button
            onClick={handleGenerateTranscription}
            disabled={isTranscribing || !selectedAudio}
            className={`w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              isTranscribing
                ? 'bg-indigo-700/50 text-indigo-200 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white shadow-lg shadow-indigo-600/20'
            }`}
          >
            {isTranscribing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Transcribing...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-3.5 h-3.5" />
                <span>Transcribe Audio</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error & Fallback Banner */}
      {errorMessage && (
        <div className="px-4 py-3 bg-red-950/40 border-b border-red-900/60 flex items-start gap-3 text-xs shrink-0">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="font-semibold text-red-300">Gemini Transcription Issue</div>
            <div className="text-red-400/90 mt-0.5">{errorMessage}</div>
            {errorMessage.toLowerCase().includes('not found') && (
              <div className="mt-2 flex items-center gap-2">
                <span className="text-slate-400">Model name not recognized? Try fallback:</span>
                <button
                  onClick={() => {
                    setModel('gemini-2.5-flash');
                    setErrorMessage(null);
                  }}
                  className="px-2 py-0.5 rounded bg-red-900/60 hover:bg-red-800/80 text-white text-[11px] font-semibold"
                >
                  Switch to gemini-2.5-flash
                </button>
                <button
                  onClick={() => {
                    setModel('gemini-1.5-flash');
                    setErrorMessage(null);
                  }}
                  className="px-2 py-0.5 rounded bg-red-900/60 hover:bg-red-800/80 text-white text-[11px] font-semibold"
                >
                  Switch to gemini-1.5-flash
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Progress banner during transcription */}
      {isTranscribing && (
        <div className="px-4 py-2.5 bg-indigo-950/40 border-b border-indigo-900/60 flex items-center gap-3 text-xs text-indigo-300 shrink-0">
          <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400 shrink-0" />
          <span>{transcribeProgress} (This usually takes 10 to 20 seconds for full speech extraction)</span>
        </div>
      )}

      {/* Interactive Audio Player Bar */}
      {selectedAudio && (
        <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 shrink-0">
          <audio
            ref={audioRef}
            src={audioUrl}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => setIsPlaying(false)}
            className="hidden"
          />

          <div className="flex items-center gap-3">
            <button
              onClick={togglePlayPause}
              className="w-8 h-8 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center transition-all shadow-md shadow-indigo-600/30 cursor-pointer"
              title={isPlaying ? 'Pause' : 'Play audio'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>

            <button
              onClick={() => seekAudio(0)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Restart from beginning"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <div className="font-mono text-xs text-slate-300 flex items-center gap-1.5">
              <span className="text-white font-bold">{formatSeconds(currentTime)}</span>
              <span className="text-slate-600">/</span>
              <span className="text-slate-400">{formatSeconds(audioDuration)}</span>
            </div>
          </div>

          {/* Scrubber slider */}
          <div className="flex-1 max-w-xl flex items-center gap-3 px-2">
            <input
              type="range"
              min="0"
              max={audioDuration || 100}
              step="0.05"
              value={currentTime}
              onChange={(e) => seekAudio(parseFloat(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>

          {/* Playback speed buttons */}
          <div className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
            <span>Speed:</span>
            {[0.75, 1, 1.25, 1.5].map((rate) => (
              <button
                key={rate}
                onClick={() => handleRateChange(rate)}
                className={`px-1.5 py-0.5 rounded transition-colors ${
                  playbackRate === rate
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {rate}x
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navigation Tabs & Actions Toolbar */}
        <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab('sentences')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded font-medium transition-colors ${
                activeTab === 'sentences'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Sentence Subtitles ({transcriptData?.sentences?.length || 0})</span>
            </button>

            <button
              onClick={() => setActiveTab('words')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded font-medium transition-colors ${
                activeTab === 'words'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Word Timestamps ({transcriptData?.words?.length || 0})</span>
            </button>

            <button
              onClick={() => setActiveTab('json')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded font-medium transition-colors ${
                activeTab === 'json'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Raw JSON & Edit</span>
            </button>

            <button
              onClick={() => setActiveTab('manual')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded font-medium transition-colors ${
                activeTab === 'manual'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Supply / Paste Separately</span>
            </button>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            {transcriptData && (
              <>
                <button
                  onClick={copyWordTimestampsJson}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                  title="Copy canonical HyperFrames words array"
                >
                  {copiedKey === 'word-json' ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-slate-400" />
                      <span>Copy Word JSON</span>
                    </>
                  )}
                </button>

                {onOpenPromptHelper && (
                  <button
                    onClick={onOpenPromptHelper}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-gradient-to-r from-indigo-600/30 to-cyan-600/30 hover:from-indigo-600/40 hover:to-cyan-600/40 text-indigo-200 border border-indigo-500/40 transition-all cursor-pointer shadow-sm"
                    title="Open AI Prompt Creator with this transcript pre-loaded"
                  >
                    <Sparkles className="w-3 h-3 text-indigo-400" />
                    <span>Generate Prompt with Transcript</span>
                  </button>
                )}

                <button
                  onClick={copyForPrompt}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                  title="Copy formatted markdown for ChatGPT prompt"
                >
                  {copiedKey === 'prompt-md' ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied Prompt!</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3 h-3 text-indigo-400" />
                      <span>Copy for Prompt</span>
                    </>
                  )}
                </button>

                <button
                  onClick={generateCaptionsSnippet}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-950 text-indigo-300 border border-indigo-800/80 hover:bg-indigo-900 transition-colors"
                  title="Generate HTML and GSAP code for these subtitles"
                >
                  <FileCode className="w-3 h-3 text-cyan-400" />
                  <span>Generate Subtitles Snippet</span>
                </button>

                <button
                  onClick={() => handleSaveTranscript(transcriptData)}
                  className="flex items-center gap-1 px-3 py-1 rounded-md text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
                  title="Save as assets/transcript.json on disk"
                >
                  {savedSuccess ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Saved to assets!</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3 h-3" />
                      <span>Save to Assets</span>
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Tab 1: Sentence-Level Subtitles */}
        {activeTab === 'sentences' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {!transcriptData?.sentences || transcriptData.sentences.length === 0 ? (
              <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400">
                  <Mic className="w-6 h-6" />
                </div>
                <div className="text-sm font-semibold text-slate-300">No transcription loaded yet</div>
                <div className="text-xs text-slate-500 max-w-md">
                  Click <strong>Transcribe Audio</strong> with your Gemini API key above, or load the pre-aligned <strong>Sample Bermuda Transcript</strong> to test immediately.
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 max-w-5xl mx-auto">
                {transcriptData.sentences.map((sentence) => {
                  const isActive = activeSentence?.id === sentence.id;
                  const dur = (sentence.end - sentence.start).toFixed(2);

                  return (
                    <div
                      key={sentence.id}
                      className={`p-4 rounded-xl border transition-all ${
                        isActive
                          ? 'bg-indigo-950/40 border-indigo-500/80 shadow-lg shadow-indigo-500/10'
                          : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => seekAudio(sentence.start)}
                            className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-bold transition-colors cursor-pointer ${
                              isActive
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-800 hover:bg-slate-700 text-indigo-300'
                            }`}
                            title="Play sentence"
                          >
                            <Play className="w-2.5 h-2.5" />
                            <span>{formatSeconds(sentence.start)} → {formatSeconds(sentence.end)}</span>
                          </button>

                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-900 border border-slate-800 text-slate-400">
                            {dur}s
                          </span>

                          <span className="text-[10px] font-mono text-slate-500">
                            #{sentence.id}
                          </span>
                        </div>

                        <button
                          onClick={() => copyToClipboard(sentence.text, `copy-${sentence.id}`)}
                          className="p-1 rounded text-slate-500 hover:text-slate-300 transition-colors"
                          title="Copy sentence text"
                        >
                          {copiedKey === `copy-${sentence.id}` ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      {/* Full Sentence Text */}
                      <p
                        onClick={() => seekAudio(sentence.start)}
                        className={`text-sm font-semibold cursor-pointer transition-colors ${
                          isActive ? 'text-white' : 'text-slate-200 hover:text-white'
                        }`}
                      >
                        {sentence.text}
                      </p>

                      {/* Nested Word Chips */}
                      {sentence.words && sentence.words.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-slate-900/80 flex flex-wrap gap-1.5">
                          {sentence.words.map((word) => {
                            const isWordActive = activeWord?.id === word.id;
                            return (
                              <button
                                key={word.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  seekAudio(word.start);
                                }}
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono transition-all cursor-pointer ${
                                  isWordActive
                                    ? 'bg-cyan-500 text-slate-950 font-bold scale-105 shadow-sm'
                                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
                                }`}
                                title={`Start: ${word.start}s, End: ${word.end}s`}
                              >
                                <span>{word.text}</span>
                                <span className={`text-[9px] ${isWordActive ? 'text-slate-900' : 'text-slate-500'}`}>
                                  {word.start.toFixed(1)}s
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Word-Level Timestamps */}
        {activeTab === 'words' && (
          <div className="flex-1 overflow-y-auto p-6">
            {!transcriptData?.words || transcriptData.words.length === 0 ? (
              <div className="py-20 text-center text-slate-500 text-xs">
                No word timestamps available. Transcribe audio with Gemini to populate.
              </div>
            ) : (
              <div className="max-w-5xl mx-auto space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
                  <span>Word Count: <strong>{transcriptData.words.length}</strong> words</span>
                  <span className="font-mono text-[11px]">Click any word chip to play from its timestamp</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {transcriptData.words.map((word) => {
                    const isWordActive = activeWord?.id === word.id;
                    const dur = (word.end - word.start).toFixed(2);

                    return (
                      <button
                        key={word.id}
                        onClick={() => seekAudio(word.start)}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-mono transition-all cursor-pointer ${
                          isWordActive
                            ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold shadow-md shadow-cyan-500/20 scale-105'
                            : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white'
                        }`}
                      >
                        <span className="font-sans font-semibold text-sm">{word.text}</span>
                        <span className={`text-[10px] ${isWordActive ? 'text-slate-950 font-semibold' : 'text-indigo-400'}`}>
                          {word.start.toFixed(2)}s
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Raw JSON & Edit */}
        {activeTab === 'json' && (
          <div className="flex-1 flex flex-col p-4 bg-slate-950">
            <div className="flex items-center justify-between pb-2 text-xs text-slate-400">
              <span className="font-mono text-[11px]">assets/transcript.json Editor</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    try {
                      setManualText(JSON.stringify(JSON.parse(manualText), null, 2));
                    } catch {}
                  }}
                  className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 text-[11px]"
                >
                  Format JSON
                </button>
                <button
                  onClick={handleApplyManualText}
                  className="px-3 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-[11px]"
                >
                  Apply & Save
                </button>
              </div>
            </div>
            <textarea
              value={manualText}
              onChange={(e) => setManualText(e.target.value)}
              spellCheck="false"
              className="flex-1 w-full bg-slate-950 text-slate-200 font-mono text-xs leading-relaxed p-4 border border-slate-800 rounded-xl resize-none focus:outline-none focus:border-indigo-500 selection:bg-indigo-600/40"
            />
          </div>
        )}

        {/* Tab 4: Supply / Paste Separately */}
        {activeTab === 'manual' && (
          <div className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto space-y-4">
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col gap-2">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Upload className="w-4 h-4 text-indigo-400" />
                Supply Transcription Separately
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                If you transcribed the voiceover outside this tool (e.g. from Whisper, Premiere, or another platform), paste your JSON or script below. It will be validated, saved to <code>assets/transcript.json</code>, and mapped to both word-level and sentence-level timestamps.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-400">Paste JSON or Timestamp Data:</label>
              <textarea
                value={manualText}
                onChange={(e) => setManualText(e.target.value)}
                placeholder='[
  { "id": "w0", "text": "Welcome", "start": 0.0, "end": 0.45 },
  { "id": "w1", "text": "to", "start": 0.48, "end": 0.70 }
]'
                rows={12}
                spellCheck="false"
                className="w-full bg-slate-950 text-slate-200 font-mono text-xs p-4 border border-slate-800 rounded-xl resize-none focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleApplyManualText}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 cursor-pointer"
              >
                Validate & Save to assets/transcript.json
              </button>
              <button
                onClick={handleLoadSampleTranscript}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs cursor-pointer"
              >
                Insert Sample Bermuda Triangle Transcript
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Captions Snippet Modal */}
      {showSnippetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div className="flex items-center gap-2">
                <FileCode className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">Generated HyperFrames Subtitles Snippet</h3>
              </div>
              <button
                onClick={() => setShowSnippetModal(false)}
                className="text-slate-400 hover:text-white text-xs font-semibold"
              >
                Close
              </button>
            </div>

            <div className="p-4 flex-1 overflow-y-auto bg-slate-950">
              <p className="text-xs text-slate-400 mb-3">
                Paste this into your project’s <code>index.html</code> inside <code>#root</code> and inside your GSAP timeline script to display deterministic synchronized captions:
              </p>
              <pre className="p-4 bg-slate-900 rounded-xl text-slate-200 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
                {generatedSnippet}
              </pre>
            </div>

            <div className="px-6 py-3 border-t border-slate-800 flex items-center justify-end gap-3 bg-slate-950">
              <button
                onClick={() => copyToClipboard(generatedSnippet, 'snippet-copied')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer"
              >
                {copiedKey === 'snippet-copied' ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Copied HTML!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Snippet</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
