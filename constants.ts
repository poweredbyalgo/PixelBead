
import { BeadColor } from './types';

// Helper to hex to RGB
const h2r = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
};

const createColor = (id: string, name: string, hex: string): BeadColor => ({
  id, name, hex, rgb: h2r(hex)
});

// IKEA PYSSLA (18 colors)
const IKEA_PYSSLA = [
  createColor('I01', '白色', '#FFFFFF'), createColor('I02', '黄色', '#FCDE00'),
  createColor('I03', '橙色', '#FF8500'), createColor('I04', '红色', '#E70012'),
  createColor('I05', '粉色', '#F49AC1'), createColor('I06', '紫色', '#8F4693'),
  createColor('I07', '蓝色', '#0060A9'), createColor('I08', '浅蓝', '#009EE0'),
  createColor('I09', '绿色', '#009A44'), createColor('I10', '浅绿', '#8CC63F'),
  createColor('I11', '棕色', '#603913'), createColor('I12', '黑色', '#000000'),
  createColor('I13', '灰色', '#878787'), createColor('I14', '浅黄', '#FFF392'),
  createColor('I15', '浅粉', '#F4C4D5'), createColor('I16', '浅紫', '#C7B0D1'),
  createColor('I17', '浅蓝', '#A9D2F0'), createColor('I18', '浅绿', '#C1DDB1'),
];

// NABBI (30 colors subset)
const NABBI = [
  createColor('N01', '白色', '#FFFFFF'), createColor('N02', '黑色', '#000000'),
  createColor('N03', '黄色', '#FFD90F'), createColor('N04', '橙色', '#FF8F00'),
  createColor('N05', '红色', '#DA251D'), createColor('N06', '紫色', '#6E3E75'),
  createColor('N07', '蓝色', '#005B99'), createColor('N08', '绿色', '#009640'),
  createColor('N09', '棕色', '#623B2A'), createColor('N10', '灰色', '#8F9194'),
  createColor('N11', '粉色', '#E678AA'), createColor('N12', '浅蓝', '#5CAAD9'),
  createColor('N13', '浅绿', '#83C96D'), createColor('N14', '米色', '#EBC399'),
  createColor('N15', '半透明', '#EAEAEA'), createColor('N16', '李子红', '#662483'),
  createColor('N17', '酒红', '#871636'), createColor('N18', '绿松石', '#00A0AF'),
  createColor('N19', '桃色', '#F9B68B'), createColor('N20', '铁锈红', '#9C3C23'),
  createColor('N21', '古铜色', '#C49A6C'), createColor('N22', '橄榄绿', '#6B7137'),
  createColor('N23', '深灰', '#53565A'), createColor('N24', '浅灰', '#B8BABC'),
  createColor('N25', '奶油色', '#FFF0C4'), createColor('N26', '洋红', '#C4007A'),
  createColor('N27', '深蓝', '#1C2B52'), createColor('N28', '森林绿', '#1F4226'),
  createColor('N29', '金色', '#D0A433'), createColor('N30', '银色', '#A6A9AC'),
];

// HAMA MIDI (53 colors subset)
const HAMA_MIDI = [
  createColor('H01', '白色', '#F4F4F4'), createColor('H02', '奶油色', '#F3E8C4'),
  createColor('H03', '黄色', '#F7D932'), createColor('H04', '橙色', '#FF8200'),
  createColor('H05', '红色', '#D7162A'), createColor('H06', '粉色', '#F389A9'),
  createColor('H07', '紫色', '#5B2E82'), createColor('H08', '蓝色', '#0B4490'),
  createColor('H09', '浅蓝', '#379AD5'), createColor('H10', '绿色', '#238A43'),
  createColor('H11', '浅绿', '#83C571'), createColor('H12', '棕色', '#623E2A'),
  createColor('H13', '透明', '#DDE4E7'), createColor('H17', '灰色', '#8E9295'),
  createColor('H18', '黑色', '#1B1B1B'), createColor('H19', '透明白', '#FFFFFF'),
  createColor('H20', '红棕', '#8C3022'), createColor('H21', '浅棕', '#A37454'),
  createColor('H22', '深红', '#911820'), createColor('H26', '肉色', '#F8BFA4'),
  createColor('H27', '米色', '#DDB68B'), createColor('H28', '深绿', '#0E4326'),
  createColor('H29', '红酒色', '#8E192E'), createColor('H30', '酒红', '#5C1622'),
  createColor('H31', '绿松石', '#008697'), createColor('H32', '荧光黄', '#EAF328'),
  createColor('H33', '荧光红', '#F64539'), createColor('H34', '荧光蓝', '#1582C9'),
  createColor('H35', '荧光绿', '#6BC640'), createColor('H36', '荧光橙', '#FF8C28'),
  createColor('H37', '荧光粉', '#F2699C'), createColor('H43', '浅黄', '#FFF27E'),
  createColor('H44', '浅红', '#F27D81'), createColor('H45', '浅紫', '#A690BF'),
  createColor('H46', '浅蓝', '#84BADD'), createColor('H47', '浅绿', '#9CD3B1'),
  createColor('H48', '浅粉', '#F6B3C7'), createColor('H49', '天蓝', '#188FC4'),
  createColor('H50', '青色', '#006C74'), createColor('H60', '泰迪棕', '#E4A932'),
  createColor('H70', '浅灰', '#BABCBE'), createColor('H71', '深灰', '#55585B'),
];

// PERLER (92 colors subset representation)
const PERLER = [
  createColor('P01', '白色', '#FFFFFF'), createColor('P02', '奶油色', '#E6E1C8'),
  createColor('P03', '黄色', '#F8E329'), createColor('P04', '橙色', '#FF982D'),
  createColor('P05', '红色', '#E63640'), createColor('P06', '泡泡糖粉', '#F57F9F'),
  createColor('P07', '紫色', '#8A6CB1'), createColor('P08', '深蓝', '#2B408E'),
  createColor('P09', '浅蓝', '#4690C4'), createColor('P10', '绿色', '#489A4B'),
  createColor('P11', '浅绿', '#7DCEA3'), createColor('P12', '棕色', '#6B4632'),
  createColor('P13', '灰色', '#8B9096'), createColor('P14', '黑色', '#262527'),
  createColor('P15', '透明', '#DDE5E8'), createColor('P17', '浅灰', '#BEC2C7'),
  createColor('P18', '深灰', '#57595D'), createColor('P19', '古铜色', '#CFA57C'),
  createColor('P20', '铁锈红', '#A04334'), createColor('P21', '浅棕', '#997253'),
  createColor('P22', '桃色', '#F8CCAF'), createColor('P23', '热珊瑚', '#FF5E61'),
  createColor('P26', '覆盆子', '#AB2951'), createColor('P28', '浅绿', '#99DBB6'),
  createColor('P30', '浅紫', '#9E8DC9'), createColor('P33', '芝士黄', '#FBB72D'),
  createColor('P35', '李子红', '#933E87'), createColor('P36', '青柠色', '#81C043'),
  createColor('P37', '绿松石', '#2791A7'), createColor('P38', '鹦鹉绿', '#007E7F'),
  createColor('P39', '沙色', '#E6BC8A'), createColor('P40', '黄油色', '#D68E39'),
  createColor('P42', '牙膏蓝', '#95D0D6'), createColor('P43', '长春花蓝', '#5F77B2'),
  createColor('P44', '腮红粉', '#FF968D'), createColor('P52', '三文鱼红', '#FF6F74'),
  createColor('P59', '深绿', '#1E5A36'), createColor('P60', '蓝莓色', '#7FA6D6'),
  createColor('P61', '蔓越莓红', '#782B37'), createColor('P80', '常青绿', '#314D42'),
  createColor('P82', '钴蓝', '#004C8E'), createColor('P83', '板岩蓝', '#3C4E74'),
  createColor('P85', '金色', '#BC8A2C'), createColor('P88', '樱桃红', '#B22222'),
  createColor('P90', '午夜蓝', '#121726'), createColor('P91', '银色', '#959AA1'),
  createColor('P93', '橄榄绿', '#6A6740'), createColor('P96', '蕨绿', '#4F7644'),
  createColor('P97', '杏色', '#FBB283'), createColor('P100', '薰衣草紫', '#B49AC9')
];

// ARTKAL MIDI (S-Series subset for demonstration - approx 60 commonly used)
const ARTKAL_MIDI = [
  createColor('S01', '白色', '#FFFFFF'), createColor('S02', '黑色', '#000000'),
  createColor('S03', '浅灰', '#BCC0C3'), createColor('S04', '灰色', '#888B8D'),
  createColor('S05', '深灰', '#56585B'), createColor('S06', '红色', '#E21D39'),
  createColor('S07', '深红', '#980024'), createColor('S08', '玫瑰红', '#E55982'),
  createColor('S09', '粉色', '#F59CB9'), createColor('S10', '浅粉', '#FBD3E0'),
  createColor('S11', '橙色', '#FF7E00'), createColor('S12', '浅橙', '#FFAC5D'),
  createColor('S13', '黄色', '#FFD400'), createColor('S14', '浅黄', '#FFF088'),
  createColor('S15', '绿色', '#009944'), createColor('S16', '浅绿', '#7ACC71'),
  createColor('S17', '深绿', '#006232'), createColor('S18', '蓝色', '#005BAA'),
  createColor('S19', '浅蓝', '#57A2D8'), createColor('S20', '天蓝', '#9AD4F1'),
  createColor('S21', '海军蓝', '#1D2088'), createColor('S22', '紫色', '#804696'),
  createColor('S23', '浅紫', '#B89DCA'), createColor('S24', '棕色', '#603813'),
  createColor('S25', '浅棕', '#966F4B'), createColor('S26', '米色', '#E6C3A0'),
  createColor('S27', '奶油色', '#FFF1CF'), createColor('S28', '绿松石', '#00A0A9'),
  createColor('S29', '青色', '#00666C'), createColor('S30', '洋红', '#CF0072'),
  createColor('S31', '淡粉', '#FCE4EC'), createColor('S32', '薄荷绿', '#B2EBF2'),
  createColor('S33', '薰衣草紫', '#E1BEE7'), createColor('S34', '杏色', '#FFCCBC'),
  createColor('S35', '芥末黄', '#FDD835'), createColor('S36', '橄榄绿', '#827717'),
  createColor('S37', '森林绿', '#1B5E20'), createColor('S38', '海洋蓝', '#01579B'),
  createColor('S39', '靛蓝', '#1A237E'), createColor('S40', '紫罗兰', '#4A148C'),
  createColor('S41', '炭灰', '#212121'), createColor('S42', '石色', '#757575'),
  createColor('S43', '沙色', '#D7CCC8'), createColor('S44', '咖啡色', '#3E2723'),
  createColor('S45', '铁锈红', '#BF360C'), createColor('S46', '南瓜橙', '#E64A19'),
  createColor('S47', '金色', '#FFB300'), createColor('S48', '柠檬黄', '#FFEB3B'),
  createColor('S49', '青柠', '#CDDC39'), createColor('S50', '叶绿', '#8BC34A'),
];

export const PALETTES: Record<string, { name: string; colors: BeadColor[] }> = {
  'none': { name: '无特定色板 (自动提取)', colors: [] },
  'artkal': { name: 'Artkal Midi (150+色)', colors: ARTKAL_MIDI },
  'perler': { name: 'Perler (92色)', colors: PERLER },
  'hama': { name: 'Hama Midi (53色)', colors: HAMA_MIDI },
  'nabbi': { name: 'Nabbi (30色)', colors: NABBI },
  'ikea': { name: 'Ikea Pyssla (18色)', colors: IKEA_PYSSLA },
};

export interface StylePreset {
  id: string;
  name: string;
  prompt: string;
  description: string;
  thumbnailColor: string; // Fallback placeholder color
}

export const STYLES: StylePreset[] = [
  {
    id: 'pixel-art',
    name: '8位像素风',
    prompt: 'Convert this image into a strict 8-bit pixel art style. Low detail, limited color palette, blocky structures, retro video game aesthetic.',
    description: '经典复古游戏外观',
    thumbnailColor: '#3b82f6'
  },
  {
    id: 'cartoon',
    name: '鲜艳卡通',
    prompt: 'Convert this image into a vibrant, high-contrast cartoon style. Bold black outlines, solid flat colors, simplified details, cheerful and bright.',
    description: '粗线条与扁平色块',
    thumbnailColor: '#f59e0b'
  },
  {
    id: 'pastel',
    name: '梦幻柔彩',
    prompt: 'Convert this image into a cute, soft pastel color palette style. Kawaii aesthetic, rounded shapes, dreamy atmosphere, light pinks, blues and yellows.',
    description: '柔和可爱的色调',
    thumbnailColor: '#f472b6'
  },
  {
    id: 'pop-art',
    name: '波普艺术',
    prompt: 'Convert this image into a Pop Art style inspired by Andy Warhol. High contrast, saturated unnatural colors, halftone patterns, bold graphic look.',
    description: '高对比度多彩风格',
    thumbnailColor: '#ef4444'
  },
  {
    id: 'sketch',
    name: '单色素描',
    prompt: 'Convert this image into a black and white pencil sketch or ink drawing. Stark contrast, hatching lines, artistic and rough.',
    description: '黑白艺术素描',
    thumbnailColor: '#64748b'
  },
  {
    id: 'isometric',
    name: '等轴体素',
    prompt: 'Convert this image into an isometric voxel art style. 3D blocky appearance, clean edges, geometric shapes, toy-like miniature look.',
    description: '3D 积木外观',
    thumbnailColor: '#8b5cf6'
  },
];
