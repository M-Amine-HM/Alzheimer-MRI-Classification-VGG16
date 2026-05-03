export const GITHUB_URL =
  'https://github.com/M-Amine-HM/Alzheimer-MRI-Classification-VGG16';

export const CLASSES = [
  {
    key: 'Non Demented',
    color: '#27AE60',
    icon: '🟢',
    short:
      "No signs of Alzheimer's disease detected. Brain structure appears normal with no significant cognitive decline indicators.",
    datasetCount: 3200,
    expanded:
      "No signs of Alzheimer's disease detected on this automated assessment. Brain structure appears broadly consistent with no significant cognitive-decline pattern suggested by the model. Maintain routine wellness visits and discuss any symptoms with your clinician.",
  },
  {
    key: 'Very Mild Demented',
    color: '#F39C12',
    icon: '🟡',
    short:
      'Very early stage with minimal cognitive changes. Slight memory lapses may occur but daily functioning remains largely unaffected.',
    datasetCount: 2240,
    expanded:
      'Very early-stage pattern with subtle changes only. Day-to-day independence is usually preserved, though occasional memory slips can appear. Early specialist discussion can help establish a baseline and planning.',
  },
  {
    key: 'Mild Demented',
    color: '#E67E22',
    icon: '🟠',
    short:
      'Noticeable cognitive decline affecting memory, problem-solving and daily tasks. Early medical intervention is recommended.',
    datasetCount: 896,
    expanded:
      'Noticeable cognitive decline may affect memory, planning, and everyday tasks. Coordinated medical evaluation is recommended to clarify diagnosis and tailor supportive strategies.',
  },
  {
    key: 'Moderate Demented',
    color: '#E74C3C',
    icon: '🔴',
    short:
      'Significant cognitive impairment requiring continuous care. Major memory loss and difficulty with basic daily activities.',
    datasetCount: 64,
    expanded:
      'Significant impairment may impact safety, communication, and independence with basic activities. Prompt comprehensive medical assessment and caregiver planning are important.',
  },
];

export const RECOMMENDATIONS = {
  'Non Demented':
    'No immediate action required based on this screening-style output. Regular check-ups recommended.',
  'Very Mild Demented': 'Consult a neurologist for early evaluation.',
  'Mild Demented': 'Medical intervention recommended. Seek specialist care.',
  'Moderate Demented': 'Immediate medical attention required.',
};

export function getClassDef(name) {
  return CLASSES.find((c) => c.key === name);
}
