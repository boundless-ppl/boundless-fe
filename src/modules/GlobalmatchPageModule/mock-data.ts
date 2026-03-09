/**
 * Mock Data for GlobalMatch AI Feature
 * This data simulates the API response for testing UI without backend
 */

import type { ProfileSubmissionResponse, RecommendationResult } from "@/lib/api-types";

export const MOCK_RECOMMENDATION_RESULT: RecommendationResult = {
  student_profile_summary: {
    academic_background: "Strong STEM foundation with focus on Computer Science and Mathematics",
    experience_summary: "Demonstrated academic readiness with excellent GPA and relevant coursework",
    strengths: ["Strong analytical skills", "Solid programming foundation", "Mathematics proficiency"],
    improvement_areas: ["Limited extracurricular activities", "Research experience could be stronger"],
    preferred_themes: ["Computer Science", "Artificial Intelligence", "Data Science"],
    raw_text: "Strong overall fit for graduate programs in computer science and related fields"
  },
  top_recommendations: [
    {
      rank: 1,
      university_name: "ETH Zurich",
      program_name: "Master in Computer Science",
      country: "Switzerland",
      fit_score: 95,
      admission_chance_score: 75,
      overall_recommendation_score: 88,
      fit_level: "high",
      admission_difficulty: "moderate",
      score_breakdown: {
        academic_fit: 95,
        preference_match: 92,
        curriculum_relevance: 94,
        admission_chance: 75
      },
      overview: "ETH Zurich offers a world-class Computer Science program with cutting-edge research in AI, systems, and theory. The program provides excellent faculty-student ratio and strong industry connections in Switzerland.",
      why_this_university: "ETH Zurich is ranked #6 globally and is known for its rigorous academic standards and innovation in technology. The university has state-of-the-art research facilities and strong partnerships with tech companies.",
      why_this_program: "The Master in CS program aligns perfectly with your background in programming and mathematics. It offers specializations in AI, machine learning, and data science that match your interests.",
      preference_reasoning: [
        "Located in Switzerland, matching your preferred region",
        "Strong focus on AI and machine learning",
        "Excellent research opportunities in your area of interest"
      ],
      match_evidence: [
        "Your GPA of 3.8 exceeds their minimum requirement",
        "Your coursework in algorithms and data structures aligns with curriculum",
        "Strong math background matches their quantitative focus"
      ],
      scholarship_recommendations: [
        {
          scholarship_name: "ETH Excellence Scholarship",
          coverage_summary: "Full tuition coverage + CHF 12,000/semester stipend",
          selectivity: "high",
          eligibility_hint: "Requires exceptional academic record (GPA 3.7+) and strong research potential"
        },
        {
          scholarship_name: "Swiss Government Excellence Scholarship",
          coverage_summary: "Full tuition + living expenses + health insurance",
          selectivity: "high",
          eligibility_hint: "Open to outstanding international students with research focus"
        }
      ],
      pros: [
        "Top-ranked university globally (#6 QS 2024)",
        "Strong industry connections in tech sector",
        "Located in Zurich, a major tech hub",
        "English-taught program"
      ],
      cons: [
        "High cost of living in Switzerland",
        "Very competitive admission process",
        "Limited scholarship availability"
      ]
    },
    {
      rank: 2,
      university_name: "Technical University of Munich",
      program_name: "Master in Data Science",
      country: "Germany",
      fit_score: 92,
      admission_chance_score: 80,
      overall_recommendation_score: 86,
      fit_level: "high",
      admission_difficulty: "moderate",
      score_breakdown: {
        academic_fit: 90,
        preference_match: 88,
        curriculum_relevance: 92,
        admission_chance: 80
      },
      overview: "TUM offers an interdisciplinary Data Science program combining computer science, statistics, and domain expertise. The program is highly regarded in Europe with strong industry partnerships.",
      why_this_university: "TUM is ranked #37 globally and is Germany's top technical university. It has excellent research facilities and strong connections with BMW, Siemens, and other tech companies.",
      why_this_program: "The Data Science program perfectly matches your statistics coursework and programming skills. It offers hands-on projects with real-world datasets and industry collaborations.",
      preference_reasoning: [
        "Located in Germany, your preferred country",
        "Strong data science curriculum",
        "Affordable tuition fees (Free for EU/EEA, ~€3,000/semester for non-EU)"
      ],
      match_evidence: [
        "Your statistics background aligns with program requirements",
        "Strong programming skills match their technical focus",
        "GPA meets their admission criteria"
      ],
      scholarship_recommendations: [
        {
          scholarship_name: "DAAD Scholarship",
          coverage_summary: "€934/month living allowance + health insurance",
          selectivity: "moderate",
          eligibility_hint: "Open to international students with strong academic record"
        }
      ],
      pros: [
        "Free tuition fees (€138/semester admin fee)",
        "Located in Munich tech hub",
        "Strong industry connections",
        "High admission chances"
      ],
      cons: [
        "Competitive job market for non-German speakers",
        "Some courses require German language"
      ]
    },
    {
      rank: 3,
      university_name: "National University of Singapore",
      program_name: "Master of Computing - AI Specialization",
      country: "Singapore",
      fit_score: 90,
      admission_chance_score: 82,
      overall_recommendation_score: 85,
      fit_level: "high",
      admission_difficulty: "moderate",
      score_breakdown: {
        academic_fit: 88,
        preference_match: 90,
        curriculum_relevance: 91,
        admission_chance: 82
      },
      overview: "NUS offers a comprehensive computing program with strong AI specialization. The program combines theoretical foundations with practical applications in one of Asia's leading tech hubs.",
      why_this_university: "NUS is ranked #8 globally and is Asia's top university for computer science. It has world-class faculty and cutting-edge research in AI and machine learning.",
      why_this_program: "The AI specialization offers deep learning, NLP, and computer vision courses that align with your interests. Strong industry partnerships provide internship opportunities.",
      preference_reasoning: [
        "Located in Singapore, matching your Asia preference",
        "Strong AI and ML research focus",
        "English as primary language of instruction"
      ],
      match_evidence: [
        "Your programming skills exceed entry requirements",
        "Academic background aligns with prerequisites",
        "Strong potential for research assistantship"
      ],
      scholarship_recommendations: [
        {
          scholarship_name: "NUS Graduate Scholarship",
          coverage_summary: "Full tuition + SGD 2,000/month stipend",
          selectivity: "moderate",
          eligibility_hint: "Merit-based, requires research commitment"
        }
      ],
      pros: [
        "Top-ranked in Asia for CS",
        "Vibrant tech ecosystem in Singapore",
        "Strong alumni network",
        "English-speaking environment"
      ],
      cons: [
        "High cost of living in Singapore",
        "Requires teaching assistant duties for scholarship"
      ]
    },
    {
      rank: 4,
      university_name: "University of Tokyo",
      program_name: "Master of Information Science and Technology",
      country: "Japan",
      fit_score: 85,
      admission_chance_score: 70,
      overall_recommendation_score: 80,
      fit_level: "high",
      admission_difficulty: "high",
      score_breakdown: {
        academic_fit: 85,
        preference_match: 88,
        curriculum_relevance: 84,
        admission_chance: 70
      },
      overview: "The University of Tokyo offers a rigorous program in information science with cutting-edge research in robotics, AI, and human-computer interaction.",
      why_this_university: "UTokyo is Japan's top university and ranked #29 globally. It offers world-class research facilities and unique perspectives on AI and technology.",
      why_this_program: "The program offers unique opportunities in robotics and human-centered AI that complement your technical background with interdisciplinary approaches.",
      preference_reasoning: [
        "Located in Japan, aligning with your Asia interest",
        "Unique research opportunities in robotics",
        "Strong government and industry support"
      ],
      match_evidence: [
        "Academic credentials meet entrance requirements",
        "Technical skills align with program expectations"
      ],
      scholarship_recommendations: [
        {
          scholarship_name: "MEXT Scholarship",
          coverage_summary: "Full tuition waiver + ¥144,000/month stipend",
          selectivity: "high",
          eligibility_hint: "Government scholarship for outstanding international students"
        }
      ],
      pros: [
        "Prestigious university in Asia",
        "Unique research focus on robotics",
        "Full scholarship available (MEXT)",
        "Rich cultural experience"
      ],
      cons: [
        "Japanese language required for daily life",
        "Very competitive admission",
        "Bureaucratic processes"
      ]
    },
    {
      rank: 5,
      university_name: "University of Toronto",
      program_name: "Master of Science in Applied Computing",
      country: "Canada",
      fit_score: 83,
      admission_chance_score: 78,
      overall_recommendation_score: 81,
      fit_level: "high",
      admission_difficulty: "moderate",
      score_breakdown: {
        academic_fit: 82,
        preference_match: 80,
        curriculum_relevance: 85,
        admission_chance: 78
      },
      overview: "UofT's Applied Computing program focuses on practical applications of computer science in various domains with strong industry collaboration.",
      why_this_university: "University of Toronto is Canada's top university and ranked #21 globally. It's located in Toronto, Canada's largest tech hub with thriving startup ecosystem.",
      why_this_program: "The applied focus of this program provides hands-on experience with real-world projects while maintaining strong theoretical foundations.",
      preference_reasoning: [
        "Canada offers post-graduation work opportunities",
        "Toronto is a major tech hub",
        "Multicultural environment"
      ],
      match_evidence: [
        "Your practical experience aligns with applied focus",
        "Academic background meets requirements"
      ],
      scholarship_recommendations: [
        {
          scholarship_name: "Ontario Graduate Scholarship",
          coverage_summary: "CAD 15,000 per year",
          selectivity: "moderate",
          eligibility_hint: "Merit-based for graduate students"
        }
      ],
      pros: [
        "Strong tech industry in Toronto",
        "Post-graduation work permit available",
        "Multicultural city",
        "Good admission chances"
      ],
      cons: [
        "High tuition for international students",
        "Cold weather",
        "Competitive job market"
      ]
    }
  ],
  selection_reasoning: "These recommendations prioritize universities with strong AI and computer science programs that match your academic background and preferences. We've balanced reach schools (ETH, UTokyo) with target schools (TUM, NUS) and safer options (UofT) based on your profile.",
  application_strategy: {
    ambitious: "Apply to ETH Zurich and University of Tokyo as reach schools - they have the highest rankings but most competitive admissions. Prepare exceptional research proposals and secure strong recommendation letters.",
    target: "Focus on TUM and NUS as your primary targets - both offer excellent programs with reasonable admission chances. These align well with your profile and offer good scholarship opportunities.",
    balanced_option: "Include University of Toronto as a balanced option with good admission chances and strong program quality. Consider 1-2 additional schools in similar ranking range as backup."
  },
  final_notes: [
    "Start preparing for English proficiency tests (TOEFL/IELTS) immediately if not already done",
    "Contact professors at your target universities to explore research opportunities",
    "Scholarship deadlines are often earlier than admission deadlines - check and mark your calendar",
    "Consider applying for DAAD, MEXT, and institutional scholarships simultaneously",
    "Strengthen your research profile with publications or projects if possible before application"
  ]
};

export const MOCK_API_RESPONSE: ProfileSubmissionResponse = {
  submission_id: "mock-uuid-12345",
  status: "completed",
  result_set_id: "mock-result-uuid-67890",
  result: MOCK_RECOMMENDATION_RESULT
};

/**
 * Simulates API delay for more realistic testing
 */
export async function mockApiDelay(ms: number = 2000): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
