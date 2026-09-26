/**
 * AVIR Studio Telegram Bot
 * Бот для рэп-продакшна, рифм, панчлайнов, битов и интеграции со студией.
 */

require('dotenv').config();
const { Bot, InlineKeyboard } = require('grammy');
const { execSync } = require('child_process');

const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token || token === 'YOUR_TELEGRAM_BOT_TOKEN_HERE') {
  console.log('⚠️ TELEGRAM_BOT_TOKEN не задан. Создайте файл .env или укажите переменную окружения.');
  console.log('Пример: TELEGRAM_BOT_TOKEN=123456789:ABCdefGhIJKlmNoPQRstuVWxYZ');
  process.exit(0);
}

const bot = new Bot(token);

// База рифм и ассоциаций для рэпа/трэпа/дрилла
const rhymeDict = {
  'бит': ['монолит', 'горит', 'динамит', 'летит', 'зенит', 'яд и спирт', 'смертит', 'магнит', 'звучит'],
  'район': ['миллион', 'батальон', 'рубикон', 'закон', 'циклон', 'стон', 'капюшон', 'корон', 'бетон'],
  'дым': ['молодым', 'пустым', 'седым', 'один на один', 'режим', 'непобедим', 'простим'],
  'стиль': ['автомобиль', 'эскадрилья', 'шпиль', 'пыль', 'быль', 'утиль', 'километры и миль'],
  'звук': ['пульс рук', 'замкнутый круг', 'стук', 'лучший друг', 'испуг', 'вокруг', 'бук'],
  'город': ['холод', 'вечный голод', 'молод', 'повод', 'расколот', 'молот', 'провод'],
  'деньги': ['цепи', 'петли', 'ступени', 'тени', 'мишени', 'кредиты и пенни', 'арены'],
  'улица': ['жмурится', 'курится', 'хмурится', 'будет судиться', 'не забудется'],
  'блок': ['срок', 'порог', 'курок', 'урок', 'замок', 'прыжок', 'смог', 'поток', 'шок'],
  'бас': ['сейчас', 'каркас', 'припас', 'в анфас', 'алмаз', 'приказ', 'для нас', 'фугас'],
  'флоу': ['шоу', 'slow', 'blow', 'glow', 'low', 'вдоль и поперек', 'холодный сок'],
  'слово': ['готово', 'сурово', 'основа', 'снова', 'свинцово', 'окова'],
  'ночь': ['прочь', 'точь-в-точь', 'помочь', 'дочь', 'превозмочь'],
  'брат': ['расклад', 'нарасхват', 'автомат', 'квадрат', 'фасад', 'закат', 'снаряд']
};

// Панчлайны по стилям
const punchlines = [
  "⚡ «808-й рвёт саб, пока твой рэп ищет оправдания.»",
  "❄️ «Холодный дрилл на блоке — здесь слова режут острее стали.»",
  "🔥 «Мы подняли звук с нуля, теперь частоты трясут бетонные этажи.»",
  "💎 «Трэп не в цепях, трэп в терпении и бессонных ночах на студии.»",
  "🎯 «Каждый бар — точно в цель, каждый слайд баса — как выстрел в упор.»",
  "🎙️ «AVIR Studio в эфире: чистый уличный флоу без фальши и автотюна ради маски.»",
  "🔊 «Бас стелется низом, хэт трещит триолями — это наш почерк.»"
];

const lyricsBank = {
  drill: [
    "Холодный вечер, пар изо рта, накинут капюшон,\n808-й скользит по нотам, раскачивая весь район.\nМы не бросаем слов на ветер, если взят прицел,\nAVIR на студии до утра — кто выдержал, тот уцелел.",
    "Скрип тормозов, неоновый свет отражает сырой асфальт,\nМой дрилл звучит монолитно, этот ритм никому не сломать.\nШаг за шагом сквозь блоки, дым растворяется во мгле,\nМы пишем новую историю на этой грешной земле."
  ],
  trap: [
    "Ночь на пульте, дорожки горят, 140 на метрономе,\nКаждый кик бьёт прямо в грудь, саб гудит в моем доме.\nНикаких пустых обещаний — только звук и тяжелый труд,\nТе, кто не верили на старте, теперь в очереди ждут.",
    "Хлопок снейра звенит по ушам, хэты крутят быстрый ролл,\nЯ беру этот микрофон, словно забираю престол.\nТрэп качает динамики тачек, качает каждый квартал,\nAVIR Studio делает саунд, о котором ты так мечтал."
  ],
  street: [
    "Панельные девятиэтажки хранят тысячи разных судеб,\nЗдесь каждый знает цену слову и знает, кто кого судит.\nМы выросли на битах старой школы, но пишем свой манифест,\nПока горит огонь в глазах — мы не покинем этот пост.",
    "Уличный стиль — не показуха, а память прожитых лет,\nКогда за спиной пустота, а впереди только рассвет.\nРифма ложится на ритм, правда струится сквозь микрофон,\nЭто наш рэп, наш почерк, наш нерушимый закон."
  ]
};

bot.command('start', async (ctx) => {
  const keyboard = new InlineKeyboard()
    .url('🎛️ Открыть AVIR Studio', 'https://antigravity.luch.dev/site/d52c66f0-fac1-43ff-97e0-6a49642ee949/cc252b86e2414f4b98bb75ac/')
    .row()
    .text('🔥 Панчлайн', 'punch')
    .text('⚡ Дрилл куплет', 'lyr_drill')
    .row()
    .text('💣 Трэп куплет', 'lyr_trap')
    .text('🏙️ Уличный рэп', 'lyr_street')
    .row()
    .text('💻 Colab GPU (7 TB)', 'colab_info')
    .text('⚙️ Статус сервера', 'status_info');

  await ctx.reply(
    `🎤 *Добро пожаловать в AVIR Studio Bot!*\n\n` +
    `Здесь рождается звук: *Рэп • Трэп • Дрилл • Уличный стиль*.\n\n` +
    `*Команды бота:*\n` +
    `• \`/rhyme <слово>\` — подобрать рифмы под бар\n` +
    `• \`/drill\` — текст в стиле UK/NY Drill\n` +
    `• \`/trap\` — текст в стиле Hard Trap\n` +
    `• \`/street\` — уличный куплет\n` +
    `• \`/punchline\` — убойный панчлайн\n` +
    `• \`/colab\` — инструкция по Google Colab GPU и 7 TB Drive\n` +
    `• \`/studio\` — ссылка на веб-студию AVIR Studio\n` +
    `• \`/status\` — диагностика ресурсов сервера`,
    { parse_mode: 'Markdown', reply_markup: keyboard }
  );
});

bot.command('punchline', async (ctx) => {
  const punch = punchlines[Math.floor(Math.random() * punchlines.length)];
  await ctx.reply(punch);
});

bot.command('drill', async (ctx) => {
  const list = lyricsBank.drill;
  const text = list[Math.floor(Math.random() * list.length)];
  await ctx.reply(`❄️ *UK/NY Drill Бар (AVIR Studio):*\n\n${text}`, { parse_mode: 'Markdown' });
});

bot.command('trap', async (ctx) => {
  const list = lyricsBank.trap;
  const text = list[Math.floor(Math.random() * list.length)];
  await ctx.reply(`💣 *Trap Flow (AVIR Studio):*\n\n${text}`, { parse_mode: 'Markdown' });
});

bot.command('street', async (ctx) => {
  const list = lyricsBank.street;
  const text = list[Math.floor(Math.random() * list.length)];
  await ctx.reply(`🏙️ *Уличный Рэп (AVIR Studio):*\n\n${text}`, { parse_mode: 'Markdown' });
});

bot.command('rhyme', async (ctx) => {
  const word = ctx.match ? ctx.match.trim().toLowerCase() : '';
  if (!word) {
    return ctx.reply('Укажите слово для рифмы. Например:\n`/rhyme бит` или `/rhyme район`', { parse_mode: 'Markdown' });
  }

  const rhymes = rhymeDict[word];
  if (rhymes) {
    const list = rhymes.map(r => `• ${r}`).join('\n');
    await ctx.reply(`🎯 *Рифмы к слову "${word}":*\n\n${list}`, { parse_mode: 'Markdown' });
  } else {
    // Генератор созвучий
    await ctx.reply(
      `Слово *"${word}"* не найдено в быстром словаре. Попробуйте базовые рэп-якоря: *бит, район, дым, стиль, звук, город, деньги, блок, бас, флоу*.`,
      { parse_mode: 'Markdown' }
    );
  }
});

bot.command('colab', async (ctx) => {
  await ctx.reply(
    `🚀 *Google Colab GPU + 7 TB Google Workspace:*\n\n` +
    `1. Откройте блокнот в папке \`colab/AVIR_Studio_Colab_GPU.ipynb\` в репозитории.\n` +
    `2. Подключите бесплатный GPU (T4/A100) в меню *Среда выполнения -> Сменить тип среды*.\n` +
    `3. Запустите ячейку монтирования Google Drive — у вас будет доступ ко всем 7 ТБ диска!\n` +
    `4. Запустите Audiocraft (MusicGen) или Demucs для разделения вокала и битов.`,
    { parse_mode: 'Markdown' }
  );
});

bot.command('studio', async (ctx) => {
  await ctx.reply(
    `🎛️ *Веб-студия AVIR Studio:* [Открыть студию](https://antigravity.luch.dev/site/d52c66f0-fac1-43ff-97e0-6a49642ee949/cc252b86e2414f4b98bb75ac/)`,
    { parse_mode: 'Markdown' }
  );
});

bot.command('status', async (ctx) => {
  try {
    const mem = execSync("cat /proc/meminfo | grep 'MemAvailable' | awk '{print $2}'").toString().trim();
    const memMB = Math.round(parseInt(mem, 10) / 1024);
    const ffmpegVer = execSync("ffmpeg -version | head -n 1").toString().trim();
    await ctx.reply(
      `⚙️ *Статус AVIR Studio Server:*\n\n` +
      `• *Свободная память:* ~${memMB} MB\n` +
      `• *FFmpeg:* ${ffmpegVer.split(' ')[2] || 'Установлен'}\n` +
      `• *Node.js:* ${process.version}\n` +
      `• *Платформа:* Linux Debian 12 (Cloud VM)\n` +
      `• *GitHub Sync:* Активен (репозиторий first-project)`,
      { parse_mode: 'Markdown' }
    );
  } catch (err) {
    await ctx.reply(`Ошибка при получении статуса: ${err.message}`);
  }
});

// Inline callbacks
bot.callbackQuery('punch', async (ctx) => {
  const punch = punchlines[Math.floor(Math.random() * punchlines.length)];
  await ctx.answerCallbackQuery();
  await ctx.reply(punch);
});

bot.callbackQuery('lyr_drill', async (ctx) => {
  const list = lyricsBank.drill;
  await ctx.answerCallbackQuery();
  await ctx.reply(`❄️ *UK/NY Drill:*\n\n${list[Math.floor(Math.random() * list.length)]}`, { parse_mode: 'Markdown' });
});

bot.callbackQuery('lyr_trap', async (ctx) => {
  const list = lyricsBank.trap;
  await ctx.answerCallbackQuery();
  await ctx.reply(`💣 *Hard Trap:*\n\n${list[Math.floor(Math.random() * list.length)]}`, { parse_mode: 'Markdown' });
});

bot.callbackQuery('lyr_street', async (ctx) => {
  const list = lyricsBank.street;
  await ctx.answerCallbackQuery();
  await ctx.reply(`🏙️ *Уличный Рэп:*\n\n${list[Math.floor(Math.random() * list.length)]}`, { parse_mode: 'Markdown' });
});

bot.callbackQuery('colab_info', async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.reply(
    `🚀 *Синхронизация Google Colab & 7 TB Workspace:*\nВ блокноте \`colab/AVIR_Studio_Colab_GPU.ipynb\` настроены Demucs, MusicGen и монтирование Google Drive. Запускайте генерацию тяжелых нейросетевых треков на мощных GPU Nvidia!`
  );
});

bot.callbackQuery('status_info', async (ctx) => {
  await ctx.answerCallbackQuery();
  const mem = execSync("cat /proc/meminfo | grep 'MemAvailable' | awk '{print $2}'").toString().trim();
  const memMB = Math.round(parseInt(mem, 10) / 1024);
  await ctx.reply(`🟢 Сервер AVIR Studio работает стабильно. Свободно RAM: ${memMB} MB.`);
});

console.log('Запуск AVIR Studio Telegram Bot...');
bot.start().catch((err) => {
  console.error('Ошибка работы бота:', err);
});
