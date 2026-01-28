/**
 * 技能图标映射工具
 * 为常见技能提供更好的图标显示
 */

export interface SkillIconConfig {
  icon: string;
  color?: string;
  bgColor?: string;
  bgGradient?: string;
  bgGradientDark?: string;
}

/**
 * 根据技能名称获取推荐的图标配置
 */
export function getSkillIcon(skillName: string, skillIcon?: string | null): SkillIconConfig {
  // 技能名称转小写用于匹配
  const name = skillName.toLowerCase().trim();
  
  // 优先使用智能映射的图标，而不是数据库中存储的图标
  // 这样可以确保使用更好的品牌图标

  // 常见技能图标映射
  const iconMap: Record<string, SkillIconConfig> = {
    // HTML
    html: { 
      icon: 'fa-brands fa-html5', 
      color: 'text-orange-500',
      bgGradient: 'from-orange-50 to-orange-100',
      bgGradientDark: 'from-orange-900/30 to-orange-800/20'
    },
    html5: { 
      icon: 'fa-brands fa-html5', 
      color: 'text-orange-500',
      bgGradient: 'from-orange-50 to-orange-100',
      bgGradientDark: 'from-orange-900/30 to-orange-800/20'
    },
    
    // CSS
    css: { 
      icon: 'fa-brands fa-css3-alt', 
      color: 'text-blue-500',
      bgGradient: 'from-blue-50 to-cyan-100',
      bgGradientDark: 'from-blue-900/30 to-cyan-800/20'
    },
    css3: { 
      icon: 'fa-brands fa-css3-alt', 
      color: 'text-blue-500',
      bgGradient: 'from-blue-50 to-cyan-100',
      bgGradientDark: 'from-blue-900/30 to-cyan-800/20'
    },
    
    // JavaScript
    javascript: { 
      icon: 'fa-brands fa-js', 
      color: 'text-yellow-500',
      bgGradient: 'from-yellow-50 to-amber-100',
      bgGradientDark: 'from-yellow-900/30 to-amber-800/20'
    },
    js: { 
      icon: 'fa-brands fa-js', 
      color: 'text-yellow-500',
      bgGradient: 'from-yellow-50 to-amber-100',
      bgGradientDark: 'from-yellow-900/30 to-amber-800/20'
    },
    
    // TypeScript
    typescript: { 
      icon: 'fa-brands fa-js-square', 
      color: 'text-blue-600',
      bgGradient: 'from-indigo-50 to-blue-100',
      bgGradientDark: 'from-indigo-900/30 to-blue-800/20'
    },
    ts: { 
      icon: 'fa-brands fa-js-square', 
      color: 'text-blue-600',
      bgGradient: 'from-indigo-50 to-blue-100',
      bgGradientDark: 'from-indigo-900/30 to-blue-800/20'
    },
    
    // Vue
    vue: { icon: 'fa-brands fa-vuejs', color: 'text-green-500' },
    vuejs: { icon: 'fa-brands fa-vuejs', color: 'text-green-500' },
    
    // React
    react: { icon: 'fa-brands fa-react', color: 'text-cyan-500' },
    
    // Node.js
    node: { icon: 'fa-brands fa-node', color: 'text-green-600' },
    'node.js': { icon: 'fa-brands fa-node', color: 'text-green-600' },
    nodejs: { icon: 'fa-brands fa-node', color: 'text-green-600' },
    
    // Python
    python: { icon: 'fa-brands fa-python', color: 'text-blue-500' },
    
    // Java
    java: { icon: 'fa-brands fa-java', color: 'text-orange-600' },
    
    // Git
    git: { icon: 'fa-brands fa-git-alt', color: 'text-orange-600' },
    
    // GitHub
    github: { icon: 'fa-brands fa-github', color: 'text-gray-800' },
    
    // Docker
    docker: { icon: 'fa-brands fa-docker', color: 'text-blue-500' },
    
    // AWS
    aws: { icon: 'fa-brands fa-aws', color: 'text-orange-500' },
    
    // Linux
    linux: { icon: 'fa-brands fa-linux', color: 'text-yellow-600' },
    
    // PHP
    php: { icon: 'fa-brands fa-php', color: 'text-indigo-500' },
    
    // Go
    go: { icon: 'fa-brands fa-golang', color: 'text-cyan-600' },
    golang: { icon: 'fa-brands fa-golang', color: 'text-cyan-600' },
    
    // Rust
    rust: { icon: 'fa-brands fa-rust', color: 'text-orange-700' },
    
    // Angular
    angular: { icon: 'fa-brands fa-angular', color: 'text-red-600' },
    
    // Sass/SCSS
    sass: { icon: 'fa-brands fa-sass', color: 'text-pink-600' },
    scss: { icon: 'fa-brands fa-sass', color: 'text-pink-600' },
    
    // Less
    less: { icon: 'fa-brands fa-less', color: 'text-blue-600' },
    
    // Tailwind CSS
    tailwind: { icon: 'fa-solid fa-wind', color: 'text-cyan-500' },
    'tailwind css': { icon: 'fa-solid fa-wind', color: 'text-cyan-500' },
    
    // Bootstrap
    bootstrap: { icon: 'fa-brands fa-bootstrap', color: 'text-purple-600' },
    
    // MongoDB
    mongodb: { icon: 'fa-brands fa-envira', color: 'text-green-600' },
    mongo: { icon: 'fa-brands fa-envira', color: 'text-green-600' },
    
    // MySQL
    mysql: { icon: 'fa-solid fa-database', color: 'text-blue-600' },
    
    // PostgreSQL
    postgresql: { icon: 'fa-solid fa-database', color: 'text-blue-700' },
    postgres: { icon: 'fa-solid fa-database', color: 'text-blue-700' },
    
    // Redis
    redis: { icon: 'fa-solid fa-database', color: 'text-red-600' },
    
    // Nginx
    nginx: { icon: 'fa-solid fa-server', color: 'text-green-600' },
    
    // Webpack
    webpack: { icon: 'fa-solid fa-box', color: 'text-blue-500' },
    
    // Vite
    vite: { icon: 'fa-solid fa-bolt', color: 'text-yellow-500' },
  };

  // 精确匹配
  if (iconMap[name]) {
    return iconMap[name];
  }

  // 部分匹配
  for (const [key, config] of Object.entries(iconMap)) {
    if (name.includes(key) || key.includes(name)) {
      return config;
    }
  }

  // 如果数据库中有自定义图标，且没有匹配到映射，则使用自定义图标
  if (skillIcon) {
    return {
      icon: skillIcon,
    };
  }

  // 默认图标
  return {
    icon: 'fa-solid fa-code',
  };
}
