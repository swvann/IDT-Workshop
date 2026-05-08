const coursesData = [
  {
    id: 'bds101',
    title: 'Introduction to Biomedical Informatics',
    instructor: 'Dr. Sarah Chen',
    credits: 3,
    workload: '8-10',
    level: 'Beginner',
    tags: ['EHR', 'Data Standards', 'Healthcare Systems', 'Python'],
    description: 'A foundational overview of how data is generated, stored, and utilized within modern healthcare systems, with a focus on Electronic Health Records (EHR) and data interoperability.',
    coreTopics: ['EHR Architecture', 'HL7 & FHIR Standards', 'Clinical Decision Support', 'Data Privacy & HIPAA'],
    prerequisites: 'None'
  },
  {
    id: 'bds201',
    title: 'Machine Learning for Healthcare',
    instructor: 'Dr. Alan Turing',
    credits: 4,
    workload: '12-15',
    level: 'Advanced',
    tags: ['Machine Learning', 'Deep Learning', 'Predictive Modeling', 'Python', 'PyTorch'],
    description: 'An advanced course applying machine learning and deep learning techniques to complex healthcare datasets, including medical imaging and patient outcome prediction.',
    coreTopics: ['Predictive Modeling', 'CNNs for Medical Imaging', 'Time-series Analysis of EHR', 'Model Interpretability'],
    prerequisites: 'Calculus, Linear Algebra, Python Programming'
  },
  {
    id: 'bds150',
    title: 'Genomic Data Science',
    instructor: 'Dr. Rosalind Franklin',
    credits: 4,
    workload: '10-12',
    level: 'Intermediate',
    tags: ['Genomics', 'Bioinformatics', 'R', 'DNA Sequencing'],
    description: 'Learn computational methods and tools for analyzing high-throughput genomic data to understand the genetic basis of diseases.',
    coreTopics: ['Sequence Alignment', 'Variant Calling', 'Transcriptomics (RNA-Seq)', 'Pathway Analysis'],
    prerequisites: 'Introductory Biology, Statistics'
  },
  {
    id: 'bds300',
    title: 'Clinical Trial Design & Analytics',
    instructor: 'Dr. Florence Nightingale',
    credits: 3,
    workload: '8-10',
    level: 'Intermediate',
    tags: ['Biostatistics', 'Clinical Trials', 'R', 'Survival Analysis'],
    description: 'Focuses on the statistical design, execution, and analysis of clinical trials in biomedical research.',
    coreTopics: ['Trial Phases & Designs', 'Power & Sample Size', 'Survival Analysis', 'Causal Inference'],
    prerequisites: 'Statistics'
  },
  {
    id: 'bds250',
    title: 'Healthcare NLP',
    instructor: 'Dr. Noam Chomsky',
    credits: 3,
    workload: '10-12',
    level: 'Advanced',
    tags: ['NLP', 'Text Mining', 'Clinical Notes', 'Python'],
    description: 'Techniques for extracting structured information from unstructured clinical text, such as physician notes and pathology reports.',
    coreTopics: ['Text Preprocessing', 'Named Entity Recognition (NER)', 'Information Extraction', 'Large Language Models in Medicine'],
    prerequisites: 'Machine Learning, Python'
  }
];

export default coursesData;
