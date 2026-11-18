/* ===========================================================
   信息型主题页内容
   -----------------------------------------------------------
   每个条目的 sections / faq / related 都独立撰写，不套模板。
   加一篇新页面只需在这里追加一个对象，然后运行
   node tools/generate-guides.js
   =========================================================== */
'use strict';

const guides = [

  // ---------------------------------------------------------------- 1
  {
    slug: 'how-overtime-is-calculated-in-california',
    title: 'How Overtime Is Calculated in California (Daily and Weekly Rules)',
    desc: 'California runs two overtime tests at once: hours over 8 in a day and hours over 40 in a week. Here is how they interact, when double time applies, and the mistakes that cost workers money.',
    h1: 'How Overtime Is Calculated in California',
    crumb: 'California overtime',
    homeLabel: 'California overtime: daily vs weekly',
    lede: 'California is one of the few US states that pays overtime on a daily basis as well as a weekly one. That means a long Tuesday can trigger overtime even when the week totals 35 hours — and the two tests do not stack on top of each other.',
    sections: [
      {
        h2: 'The two tests, and why they do not add up',
        body: `<p>Most US states follow the federal rule: overtime starts after 40 hours in a workweek. California adds a second, independent test based on the individual day. Both run at the same time, and you are paid under whichever produces the larger amount for that workweek — never both added together.</p>
      <div class="table-scroll">
        <table>
          <thead><tr><th>Situation</th><th>Rate</th></tr></thead>
          <tbody>
            <tr><td>More than 8 hours in a single workday</td><td>1.5× for those hours</td></tr>
            <tr><td>More than 12 hours in a single workday</td><td>2× for hours beyond 12</td></tr>
            <tr><td>More than 40 hours in a workweek</td><td>1.5× for those hours</td></tr>
            <tr><td>7th consecutive day worked in a workweek</td><td>1.5× for the first 8 hours, 2× after that</td></tr>
          </tbody>
        </table>
      </div>
      <p>The 7th-day rule is the one most people have never heard of. If you work seven days in a row within the same workweek, the seventh day is paid at 1.5× regardless of how many hours you worked, and anything beyond 8 hours on that day is paid at 2×.</p>`
      },
      {
        h2: 'A worked example',
        body: `<p>You earn $20.00 an hour and work 13 hours on a single day.</p>
      <div class="formula">8 hours × $20.00  = $160.00   (straight time)
4 hours × $30.00  = $120.00   (1.5× for hours 9–12)
1 hour  × $40.00  = $40.00    (2× for hour 13)
total             = $320.00</div>
      <p>That is 16 hours of pay for 13 hours of work. If the same 13 hours had been worked across two normal days — say 8 and 5 — the daily test would never fire, and you would be paid straight time for all of it unless the week crossed 40 hours.</p>
      <p>This is why scheduling matters as much as total hours in California. Two 10-hour days and one 8-hour day is 28 hours with 4 hours of daily overtime. Redistributing the same 28 hours as four 7-hour days produces no overtime at all.</p>`
      },
      {
        h2: 'The regular rate is not your base rate',
        body: `<p>California requires overtime to be calculated on the <em>regular rate of pay</em>, which is generally higher than the base hourly rate. It includes:</p>
      <ul>
        <li>Shift differentials for evenings, nights, or weekends</li>
        <li>Non-discretionary bonuses — production, attendance, commission tied to targets</li>
        <li>Certain incentive payments and longevity pay</li>
      </ul>
      <p>If you earn $20.00 an hour plus a $2.00 night differential, your regular rate for overtime purposes is $22.00, and the overtime rate is $33.00 rather than $30.00. Employers that apply 1.5× to the base rate alone underpay, and the shortfall compounds over a year.</p>`
      },
      {
        h2: 'How California compares',
        body: `<div class="table-scroll">
        <table>
          <thead><tr><th>State</th><th>Daily overtime</th><th>Double time</th></tr></thead>
          <tbody>
            <tr><td>California</td><td>After 8 hours</td><td>After 12 hours; 7th consecutive day</td></tr>
            <tr><td>Alaska</td><td>After 8 hours</td><td>Not required</td></tr>
            <tr><td>Nevada</td><td>After 8 hours, only if pay is below 1.5× minimum wage</td><td>Not required</td></tr>
            <tr><td>Colorado</td><td>After 12 hours</td><td>Not required</td></tr>
            <tr><td>Federal / most states</td><td>None</td><td>None required</td></tr>
          </tbody>
        </table>
      </div>
      <p>New York has daily overtime only for certain occupations, which is why "does New York have daily overtime" produces conflicting answers online. For most private-sector workers there, the weekly test is the only one.</p>`
      },
      {
        h2: 'Where people get it wrong',
        body: `<ul>
        <li><strong>Adding the two tests.</strong> A 50-hour week made of five 10-hour days is 10 hours of overtime, not 10 daily plus 10 weekly.</li>
        <li><strong>Ignoring the 7th day.</strong> A six-day schedule is common in hospitality and construction; the seventh day converts the whole shift to premium pay.</li>
        <li><strong>Using the base rate.</strong> Overtime on $20.00 when the regular rate is $22.00 understates every premium hour.</li>
        <li><strong>Assuming a salary removes overtime.</strong> California's exemption tests are strict, and a salaried employee whose duties are primarily manual or routine is generally non-exempt.</li>
        <li><strong>Not recording hours.</strong> The burden of proving hours worked falls largely on the employer in California, but a personal record is what makes a claim practical.</li>
      </ul>`
      },
      {
        h2: 'If you think you were underpaid',
        body: `<p>Start with your own timesheet: dates, start and end times including any work after clocking out, and the pay you actually received. Compare that against the rules above for each workweek separately — the workweek is fixed and seven days long, and it does not shift to avoid overtime.</p>
      <p>California's statute of limitations is generally three years for overtime claims under the Labor Code, longer than most states. The state Labor Commissioner handles wage claims without a filing fee, and a written record is the difference between a claim and a complaint.</p>`
      }
    ],
    faq: [
      { q: 'Is overtime after 8 hours or 40 hours in California?', a: 'Both. More than 8 hours in a workday is paid at 1.5×, and more than 40 hours in a workweek is also paid at 1.5×. The two tests run independently and you receive the higher amount, not the sum.' },
      { q: 'When does double time apply in California?', a: 'Hours beyond 12 in a single workday, and all hours beyond 8 on the seventh consecutive day worked in a workweek. Double time means 2× the regular rate, not 1.5×.' },
      { q: 'Does the 7th consecutive day rule apply to any seven days?', a: 'No. The seven days must fall within the same workweek. A Friday-to-Thursday run that spans two workweeks does not trigger it, because the count resets when the workweek does.' },
      { q: 'Are salaried employees in California entitled to overtime?', a: 'Only if they are exempt, which requires a salary above the threshold, payment on a salary basis, and duties that are primarily executive, administrative, or professional. A salaried employee doing mostly manual work is generally non-exempt and owed overtime.' },
      { q: 'Is a shift differential included in the overtime rate?', a: 'Yes. Shift differentials are part of the regular rate of pay, so overtime is calculated on base pay plus the differential, not on base pay alone.' },
      { q: 'What if my employer rounds my clock-in times?', a: 'Rounding is permitted only if it does not systematically underpay over time. Rounding that consistently shaves minutes in the employer\'s favour is unlawful, and the pattern is usually visible over a few weeks of records.' }
    ],
    cta: {
      title: 'Run your actual hours',
      text: 'Set the daily double-time threshold and see the premium separated from straight time.',
      label: 'Open the overtime calculator',
      href: '/overtime-pay-calculator/'
    },
    related: [
      { text: 'Overtime pay calculator', href: '/overtime-pay-calculator/' },
      { text: 'Hourly to salary calculator', href: '/hourly-to-salary-calculator/' },
      { text: 'Hourly vs salary: which pays more?', href: '/hourly-vs-salary-which-pays-more/' },
      { text: '$30 an hour is how much a year?', href: '/30-an-hour-is-how-much-a-year/' }
    ]
  },

  // ---------------------------------------------------------------- 2
  {
    slug: 'hourly-vs-salary-which-pays-more',
    title: 'Hourly vs Salary: Which Actually Pays More?',
    desc: 'A salary and an hourly rate are not comparable until both are converted to the same unit. Here is the method, the benefits people forget to price, and the situations where the higher headline number is the worse deal.',
    h1: 'Hourly vs Salary: Which Pays More?',
    crumb: 'Hourly vs salary',
    homeLabel: 'Hourly vs salary: which pays more',
    lede: 'The comparison only becomes real when both offers are expressed in the same unit — money per hour actually worked. Almost nobody does that calculation before accepting, which is why the wrong offer gets accepted for the right-sounding reason.',
    sections: [
      {
        h2: 'Convert both sides first',
        body: `<p>A $65,000 salary sounds like more than $28 an hour. Run the numbers on realistic hours and it often is not.</p>
      <div class="formula">hourly job:  $28.00 × 40 hrs × 50 weeks = $56,000
salaried job: $65,000 ÷ (45 hrs × 50 weeks)   = $28.89 per hour</div>
      <p>A nine-thousand-dollar gap in headline pay becomes a 89-cent gap per hour. If the salaried role actually runs 50-hour weeks, the effective rate drops to $26.00 and the hourly job wins outright.</p>
      <p>The unit that matters is <strong>total compensation divided by hours actually worked</strong>. Not contracted hours. Not 2,080. The hours you will really be present, including the unpaid extras that never appear in the contract.</p>`
      },
      {
        h2: 'The three numbers people forget',
        body: `<p>Cash pay is the easiest part of the comparison and the least interesting. Three other things move the answer more than a dollar an hour does.</p>
      <h3>Paid time off</h3>
      <p>Twenty days of paid leave is worth roughly 8% of salary. On $65,000 that is $5,000 of compensation that does not appear in the headline number. An hourly role with no PTO has to pay more per hour just to break even.</p>
      <h3>Benefits with a cash value</h3>
      <p>Employer health insurance contributions commonly run $6,000–$9,000 a year for a single person in the US. A 401(k) match at 4% of a $65,000 salary is another $2,600. Add those to the salaried column before comparing.</p>
      <h3>Overtime eligibility</h3>
      <p>This is where hourly work can win decisively. A non-exempt hourly employee who works 45 hours a week earns 5 hours at 1.5×. A salaried exempt employee working the same 45 hours earns nothing extra — and in most US states that is entirely lawful.</p>`
      },
      {
        h2: 'Worked comparison',
        body: `<div class="table-scroll">
        <table>
          <thead><tr><th></th><th>Hourly offer</th><th>Salaried offer</th></tr></thead>
          <tbody>
            <tr><td>Headline</td><td>$28.00/hr</td><td>$65,000/yr</td></tr>
            <tr><td>Guaranteed hours</td><td>40/week</td><td>Salaried, no cap</td></tr>
            <tr><td>Realistic hours</td><td>42/week</td><td>47/week</td></tr>
            <tr><td>Weeks worked</td><td>50</td><td>50</td></tr>
            <tr><td>Base cash</td><td>$58,800</td><td>$65,000</td></tr>
            <tr><td>Overtime</td><td>2 hrs/wk at 1.5× = $4,200</td><td>$0</td></tr>
            <tr><td>Paid leave value</td><td>$0</td><td>$5,000</td></tr>
            <tr><td>Health insurance</td><td>Buy own: −$7,000</td><td>Employer pays: $0</td></tr>
            <tr><td><strong>Effective annual</strong></td><td><strong>$56,000</strong></td><td><strong>$70,000</strong></td></tr>
            <tr><td>Hours worked</td><td>2,100</td><td>2,350</td></tr>
            <tr><td><strong>Per hour</strong></td><td><strong>$26.67</strong></td><td><strong>$29.79</strong></td></tr>
          </tbody>
        </table>
      </div>
      <p>The salary wins here — but by $3 an hour, not by the $12 the headline numbers imply. Change one assumption, such as 55-hour weeks at the salaried job, and it flips.</p>`
      },
      {
        h2: 'When hourly is the better deal',
        body: `<ul>
        <li><strong>The overtime is real and regular.</strong> A 50-hour week at $25 an hour pays $65,000. The same $65,000 salary at 50 hours is $25 an hour with no premium.</li>
        <li><strong>You value the boundary.</strong> Hourly work creates a financial signal every time someone asks for another hour. Salaried work does not, which is precisely why salaried hours creep.</li>
        <li><strong>You need cash now.</strong> Hourly work pays for the hours you work this week. A salary is smoothed across the year, which helps in slow months and hurts when you want to convert effort into money immediately.</li>
        <li><strong>The benefits are thin either way.</strong> If neither offer includes health insurance, the comparison collapses to pure arithmetic and hourly with overtime usually wins.</li>
      </ul>`
      },
      {
        h2: 'When salary is the better deal',
        body: `<ul>
        <li><strong>The hours are genuinely 40.</strong> A salary that does not require extra hours is just an hourly job with a different payment schedule, plus paid leave and benefits.</li>
        <li><strong>Income stability matters.</strong> Hourly work in sectors with seasonal demand means weeks of 20 hours that no hourly rate compensates for.</li>
        <li><strong>The benefits are substantial.</strong> Good health cover, a pension contribution, and generous leave can be worth $10,000–$15,000 a year. That is $5–$7 an hour at full time.</li>
        <li><strong>You want progression.</strong> Salaried roles usually sit on a promotion ladder. Hourly roles often top out at a rate ceiling unless you move into supervision.</li>
      </ul>`
      },
      {
        h2: 'The questions that settle it',
        body: `<p>Before deciding, get five numbers in writing. Without them the comparison is guesswork:</p>
      <ol>
        <li>What are the guaranteed minimum hours per week, if any?</li>
        <li>Is the role exempt or non-exempt for overtime?</li>
        <li>How many hours did the last person in this role actually work per week?</li>
        <li>What is the employer's contribution to health insurance and retirement, in dollars?</li>
        <li>How many days of paid leave accrue per year, and do they carry over?</li>
      </ol>
      <p>Question three is the one interviewers answer least honestly and the one that changes the arithmetic most. Ask the person who currently does the job, not the person hiring for it.</p>`
      }
    ],
    faq: [
      { q: 'How do I convert a salary to an hourly rate?', a: 'Divide it by the hours you actually work, not by 2,080. A $65,000 salary over 47-hour weeks for 50 weeks is $27.66 an hour; over a nominal 2,080 hours it looks like $31.25. The first number is real, the second is a payroll convention.' },
      { q: 'Is a salaried job always worse than hourly?', a: 'No. If the hours are genuinely around 40 and the benefits are real, a salary usually beats an equivalent hourly rate because of paid leave, health cover, and pension contributions. The problem is that those conditions are less common than job adverts suggest.' },
      { q: 'Can my employer switch me from hourly to salary to avoid overtime?', a: 'Only if the role genuinely meets the exemption tests: salary basis, salary level, and duties. Reclassifying a non-exempt job as salaried without changing the duties does not remove the overtime obligation, and it is a common source of back-pay claims.' },
      { q: 'What is a good rule of thumb for comparing offers?', a: 'Total compensation — cash plus employer benefits plus the cash value of paid leave — divided by realistic annual hours. If the difference is under about 5%, treat the offers as equal on money and decide on schedule, stability, and progression instead.' },
      { q: 'Do part-time salaried roles exist and how are they compared?', a: 'They do, usually at a pro-rated salary. Convert them the same way: annual cash plus pro-rated benefits, divided by the hours actually worked. Partial benefits are the detail people miss — health cover is often all-or-nothing rather than pro-rated.' }
    ],
    cta: {
      title: 'Convert both offers',
      text: 'Enter an hourly wage to get the annual figure, then work backwards from a salary to the real hourly rate.',
      label: 'Open the hourly to salary calculator',
      href: '/hourly-to-salary-calculator/'
    },
    related: [
      { text: 'Hourly to salary calculator', href: '/hourly-to-salary-calculator/' },
      { text: 'Overtime pay calculator', href: '/overtime-pay-calculator/' },
      { text: 'California overtime rules', href: '/how-overtime-is-calculated-in-california/' },
      { text: '$25 an hour is how much a year?', href: '/25-an-hour-is-how-much-a-year/' }
    ]
  },

  // ---------------------------------------------------------------- 3
  {
    slug: 'how-to-split-tips-fairly',
    title: 'How to Split Tips Fairly: Methods, Maths and the Legal Lines',
    desc: 'Three real methods for dividing a tip pool — by hours, by points, and by sales — with the arithmetic for each, the law on who may participate, and the practical rules that stop the argument before it starts.',
    h1: 'How to Split Tips Fairly',
    crumb: 'Splitting tips',
    homeLabel: 'How to split tips fairly',
    lede: 'A tip pool is a small redistribution system that runs on trust and a formula. Get the formula wrong, or keep it unwritten, and the pool becomes the most reliable source of conflict in the building.',
    sections: [
      {
        h2: 'Pick a method before the shift, not after',
        body: `<p>Every pool argument is really an argument about method, conducted after the money is already on the table. Three methods cover almost every real house.</p>
      <h3>By hours worked</h3>
      <div class="formula">share = pool × (your hours ÷ total hours)</div>
      <p>The default. Transparent, easy to audit, and it rewards the person who stayed until close. Its weakness is that hours are not the same as contribution: two servers can work five hours each while one turns eight tables and the other turns three.</p>
      <h3>By points</h3>
      <div class="formula">points = hours × role weight<br>
share  = pool × (your points ÷ total points)</div>
      <p>Points fix the role problem. A bartender on 1.25 points an hour and a server on 1.0 can work the same shift and finish with different amounts, which recognises that some roles generate or protect more of the pool. Weights must be written down and applied every shift.</p>
      <h3>By sales</h3>
      <div class="formula">share = pool × (your sales ÷ total sales)</div>
      <p>Used in houses where a percentage of each server's sales goes into a communal pot for support staff. It rewards whoever sold the most, which is fair to strong servers and punishing on a quiet section. Most commonly applied to tip-outs rather than the full pool.</p>`
      },
      {
        h2: 'A worked split, three ways',
        body: `<p>Pool of $840. Four people: Alex 8 hours, Priya 6, Sam 5.5, Jordan 7. Jordan is a bartender on 1.25 points; everyone else is 1.0.</p>
      <div class="table-scroll">
        <table>
          <thead><tr><th>Person</th><th class="num">Hours</th><th class="num">By hours</th><th class="num">Points</th><th class="num">By points</th></tr></thead>
          <tbody>
            <tr><td>Alex</td><td class="num">8.0</td><td class="num">$253.58</td><td class="num">8.00</td><td class="num">$237.88</td></tr>
            <tr><td>Priya</td><td class="num">6.0</td><td class="num">$190.19</td><td class="num">6.00</td><td class="num">$178.41</td></tr>
            <tr><td>Sam</td><td class="num">5.5</td><td class="num">$174.34</td><td class="num">5.50</td><td class="num">$163.54</td></tr>
            <tr><td>Jordan</td><td class="num">7.0</td><td class="num">$221.89</td><td class="num">8.75</td><td class="num">$260.18</td></tr>
            <tr><td><strong>Total</strong></td><td class="num"><strong>26.5</strong></td><td class="num"><strong>$840.00</strong></td><td class="num"><strong>28.25</strong></td><td class="num"><strong>$840.00</strong></td></tr>
          </tbody>
        </table>
      </div>
      <p>Under points, Jordan gains $38 and everyone else loses about $12. That is the entire effect of a 1.25 weight — small enough to be defensible, large enough to be visible. Weights above 1.5 tend to generate more resentment than they resolve.</p>`
      },
      {
        h2: 'Making the cents add up',
        body: `<p>Three people splitting $100 exactly get $33.333… each. Round every share to $33.33 and the pool is a cent short, which someone will notice.</p>
      <p>The rule that survives scrutiny: calculate exact shares, round each one <em>down</em> to the nearest whole unit, then distribute the leftover units to the largest shares first. The total always lands exactly on the pool amount, and the person who gets the extra cent is the one with the biggest share, which nobody objects to.</p>
      <p>Rounding to the nearest cent first and adjusting afterwards is what produces totals that drift by a few cents and arguments that last longer than the shift.</p>`
      },
      {
        h2: 'Who is allowed to be in the pool',
        body: `<p>The arithmetic is the easy half. The legal half varies by country and it is where pools get employers into trouble.</p>
      <h3>United States</h3>
      <ul>
        <li>A pool may include only employees who customarily and regularly receive tips.</li>
        <li>Managers and supervisors may not take a share, even a token one, from a pool that includes tipped employees.</li>
        <li>In states without a tip credit, the employer may not retain any portion of employee tips at all.</li>
        <li>An automatic service charge is not a tip under federal rules. How it is distributed is a policy decision, not tip law — and some states treat it differently, so the menu wording matters.</li>
      </ul>
      <h3>United Kingdom</h3>
      <p>The Employment (Allocation of Tips) Act 2023, in force since October 2024, requires 100% of tips and service charges to be passed to workers, allocated fairly, with a written policy and records. Agency workers are covered. The statutory code sets out what "fair" means and gives workers a route to a tribunal.</p>
      <h3>Canada and Ireland</h3>
      <p>Ontario and Quebec have specific rules on pooling and employer deductions; other provinces rely more on employment standards and the contract. Ireland requires electronic tips to be distributed fairly and prohibits them being used to make up contractual wages.</p>`
      },
      {
        h2: 'The policy that prevents the argument',
        body: `<p>A pool without a written policy is a pool that gets renegotiated every time someone feels wronged. Six lines on the staff room wall do more than any amount of goodwill:</p>
      <ol>
        <li>The method, named explicitly: hours, points with a published weight table, or sales.</li>
        <li>What counts as hours — side work, cleaning, pre-shift, handover.</li>
        <li>When the pool is calculated and when it is paid.</li>
        <li>Who is excluded: supervisors, owners, anyone not customarily tipped.</li>
        <li>How disputes are raised, and by when.</li>
        <li>The date the policy was last reviewed.</li>
      </ol>
      <p>Show each person their own number, not just the total. A pool that is auditable is trusted; a pool that produces one lump sum on a payslip is suspected, usually correctly, of being wrong somewhere.</p>`
      },
      {
        h2: 'Three mistakes that cause most disputes',
        body: `<ul>
        <li><strong>Retroactive weighting.</strong> Changing the points table after a shift has been worked, so that the pool redistributes against people who already earned it. This is the fastest way to lose a team.</li>
        <li><strong>Inconsistent hour recording.</strong> If side work counts for some people and not others, the pool is not being divided by the stated method, whatever the policy says.</li>
        <li><strong>Managers in the pool.</strong> Even a small percentage, even "just to cover the bar". It is unlawful in the US and corrosive everywhere.</li>
      </ul>`
      }
    ],
    faq: [
      { q: 'Should tips be split by hours worked or equally?', a: 'By hours, in almost every case. Equal splits are simpler and can work for a small team with identical shifts, but they penalise whoever takes the long or quiet shift, which pushes people away from exactly the shifts a house needs covered.' },
      { q: 'What role weight should a bartender get?', a: '1.2 to 1.3 is the usual range. Above 1.5 the weight starts to dominate the hours and generates more resentment than it resolves. Whatever you choose, publish it and apply it to every shift without exception.' },
      { q: 'Can a manager take part in a tip pool?', a: 'Not in the US, under federal rules. Managers and supervisors are excluded from pools that include customarily tipped employees. In states without a tip credit the employer may not keep any part of employee tips at all.' },
      { q: 'Is a 20% service charge the same as a tip?', a: 'Not under US federal law. An automatic service charge is employer revenue, and how it is distributed is a policy matter rather than tip law. Some states treat it differently, so the wording on the menu and the policy behind it both matter.' },
      { q: 'How do I handle a tip pool when someone leaves mid-shift?', a: 'Pay them for the hours actually worked and recalculate the pool on the remaining hours. Do not hold their share in the pool for the rest of the night, and do not redistribute it retroactively — both create the kind of grievance that outlasts the shift.' }
    ],
    cta: {
      title: 'Split tonight\'s pool',
      text: 'Enter the pool and each person\'s hours or points, and get exact shares with totals that add up.',
      label: 'Open the tip split calculator',
      href: '/tip-split-calculator/'
    },
    related: [
      { text: 'Tip split calculator', href: '/tip-split-calculator/' },
      { text: 'Overtime pay calculator', href: '/overtime-pay-calculator/' },
      { text: '$20 an hour is how much a year?', href: '/20-an-hour-is-how-much-a-year/' },
      { text: 'Hourly vs salary: which pays more?', href: '/hourly-vs-salary-which-pays-more/' }
    ]
  },

  // ---------------------------------------------------------------- 4
  {
    slug: 'what-is-a-good-freelance-rate',
    title: 'What Is a Good Freelance Rate? (And How to Find Yours)',
    desc: 'A good rate is not the market average. It is the lowest number that lets you run the business sustainably — and then a pricing decision on top of that floor. Here is how to calculate both.',
    h1: 'What Is a Good Freelance Rate?',
    crumb: 'Freelance rates',
    homeLabel: 'What is a good freelance rate',
    lede: 'The question is usually asked as "what does everyone else charge", which is the wrong question. Half of everyone else is undercharging, and copying them means copying their problem.',
    sections: [
      {
        h2: 'There are two different numbers',
        body: `<p>Freelancers confuse two things that look similar and behave completely differently.</p>
      <h3>The floor</h3>
      <p>The rate at which the business survives: it covers expenses, tax, unpaid admin time, holiday, sick days, and the income you need. Below this number you are subsidising the client with your own savings, and the longer you do it the harder it is to stop.</p>
      <h3>The price</h3>
      <p>What you actually quote, which is a judgement about value, urgency, risk, and how much you want the work. It should never be below the floor, and it is usually above it.</p>
      <p>Most pricing advice jumps straight to the second number and skips the first, which is why so much of it produces rates that feel bold and still lose money.</p>`
      },
      {
        h2: 'Calculating the floor',
        body: `<div class="formula">profit needed  = income ÷ (1 − tax rate)
revenue needed = profit needed + expenses
billable hours = weeks × hours per week × billable %
floor rate     = revenue needed ÷ billable hours</div>
      <p>Target $70,000 net, $9,000 of expenses, a 30% combined tax and contribution rate, 46 working weeks at 40 hours, 60% billable:</p>
      <ul>
        <li>Profit required: $70,000 ÷ 0.70 = $100,000</li>
        <li>Revenue required: $100,000 + $9,000 = $109,000</li>
        <li>Billable hours: 46 × 40 × 0.60 = 1,104</li>
        <li>Floor rate: $98.73 per hour</li>
      </ul>
      <p>Compare that with the number almost everyone starts from: $70,000 ÷ 2,080 = $33.65. The gap is not padding. It is tax, expenses, unpaid holiday, and the 40% of the week that earns nothing.</p>`
      },
      {
        h2: 'The billable percentage is the real lever',
        body: `<p>Utilisation changes the floor more than any other input, and unlike the rate it can be improved without renegotiating anything.</p>
      <div class="table-scroll">
        <table>
          <thead><tr><th>Billable share</th><th class="num">Billable hours</th><th class="num">Floor rate for the same income</th></tr></thead>
          <tbody>
            <tr><td>40%</td><td class="num">736</td><td class="num">$148.10</td></tr>
            <tr><td>50%</td><td class="num">920</td><td class="num">$118.48</td></tr>
            <tr><td>60%</td><td class="num">1,104</td><td class="num">$98.73</td></tr>
            <tr><td>70%</td><td class="num">1,288</td><td class="num">$84.63</td></tr>
            <tr><td>80%</td><td class="num">1,472</td><td class="num">$74.05</td></tr>
          </tbody>
        </table>
      </div>
      <p>Batching admin, templating proposals, refusing unpaid discovery, and saying no to calls that should have been emails can move you from 50% to 65% — which is worth more than a 20% rate increase, and nobody has to agree to it.</p>`
      },
      {
        h2: 'What the market will bear',
        body: `<p>Once you have a floor, positioning decides the price. Three things move a freelance rate far more than experience does:</p>
      <ul>
        <li><strong>Specificity.</strong> "Copywriter" competes with everyone. "Onboarding email sequences for B2B SaaS" competes with a dozen people and can charge three times as much.</li>
        <li><strong>Evidence.</strong> Two case studies with numbers beat a portfolio of twelve pretty pieces. Clients pay for outcomes they can imagine, not samples they can admire.</li>
        <li><strong>Scarcity that is real.</strong> Available next week is worth more than available tomorrow, which reads as desperate. A four-week lead time is a price signal.</li>
      </ul>
      <p>The practical test of whether your rate is too low: are you booked solid with clients you would rather not have? That is not a demand problem, it is a price problem.</p>`
      },
      {
        h2: 'Pricing models and when each works',
        body: `<div class="table-scroll">
        <table>
          <thead><tr><th>Model</th><th>Works when</th><th>Risk sits with</th></tr></thead>
          <tbody>
            <tr><td>Hourly</td><td>Scope is unclear, work is open-ended</td><td>Client — but you are punished for getting faster</td></tr>
            <tr><td>Day rate</td><td>Engagements of a week or more, creative and technical contracting</td><td>Shared</td></tr>
            <tr><td>Fixed price</td><td>Scope genuinely defined, you have done it before</td><td>You — scope creep is your problem</td></tr>
            <tr><td>Retainer</td><td>Ongoing availability, predictable monthly output</td><td>Shared, defined by the cap</td></tr>
            <tr><td>Value-based</td><td>The outcome is measurable and large relative to your fee</td><td>You, if you misjudge the value</td></tr>
          </tbody>
        </table>
      </div>
      <p>Your hourly floor is the internal reference for all of them. A fixed price that works out below the floor is not a strategic discount, it is a loss you have agreed to in advance.</p>`
      },
      {
        h2: 'Terms that protect the rate',
        body: `<p>The number is only half of what you get paid. The other half is whether it arrives, and when.</p>
      <ol>
        <li>Deposit of 30–50% before work starts, on any new client.</li>
        <li>A written scope with an explicit list of what is <em>not</em> included.</li>
        <li>Change requests quoted separately — no silent absorption.</li>
        <li>Late payment interest stated on the invoice, and work pausing past terms.</li>
        <li>Annual rate review with 30–60 days' notice to existing clients.</li>
      </ol>
      <p>Net 60 from a large client is an interest-free loan you are making them. Either price it in, or shorten the terms.</p>`
      }
    ],
    faq: [
      { q: 'What is a good freelance hourly rate?', a: 'There is no universal number, but there is a universal way to find yours: (target income ÷ (1 − tax rate) + expenses) ÷ billable hours. For most independent professionals in developed markets that lands somewhere between $60 and $150 an hour, with the spread explained by expenses, utilisation, and specialisation rather than talent.' },
      { q: 'Should I charge hourly or per project?', a: 'Hourly when scope is unclear, fixed price when it is genuinely defined and you have done similar work before. Fixed price captures the value of your efficiency; it also transfers scope-creep risk to you. Use the hourly floor as the internal reference for every quote.' },
      { q: 'How much should I add for unpaid admin time?', a: 'Do not add a percentage — set the billable share honestly instead. Most freelancers bill 50–70% of the hours they work. Entering 60% in the calculator already accounts for admin, proposals, invoicing, and marketing.' },
      { q: 'Is it okay to raise rates on existing clients?', a: 'Yes, annually. Give 30–60 days\' notice, apply the new rate to new work rather than work already quoted, and state a clear date. 5–10% a year is normal and rarely loses clients who value the work; keeping someone on a five-year-old rate is a pay cut every year.' },
      { q: 'Why is my freelance rate so much higher than my old salary divided by hours?', a: 'Because the employer was paying pension, insurance, holiday, sick leave, equipment, and software, and because only part of your week is billable. Dividing a salary by 2,080 hours is the single most common pricing error in freelancing.' },
      { q: 'What if clients say my rate is too high?', a: 'Some will, and that is information rather than a verdict. Compare it against your floor: if the rate is at or above the floor and the client still objects, the work is not a fit. If you are losing every quote, check whether you are selling a commodity, which is a positioning problem rather than a pricing one.' }
    ],
    cta: {
      title: 'Work out your floor',
      text: 'Enter your target income, expenses, tax rate and real billable share to get the minimum rate, day rate and a project quote.',
      label: 'Open the freelance rate calculator',
      href: '/freelance-rate-calculator/'
    },
    related: [
      { text: 'Freelance rate calculator', href: '/freelance-rate-calculator/' },
      { text: 'Hourly to salary calculator', href: '/hourly-to-salary-calculator/' },
      { text: 'Why savings goals need an inflation adjustment', href: '/savings-goal-with-inflation-explained/' },
      { text: 'Savings goal calculator with inflation', href: '/savings-goal-calculator/' },
      { text: '$45 an hour is how much a year?', href: '/45-an-hour-is-how-much-a-year/' }
    ]
  },

  // ---------------------------------------------------------------- 5
  {
    slug: 'how-long-does-it-take-to-recover-from-sleep-debt',
    title: 'How Long Does It Take to Recover From Sleep Debt?',
    desc: 'Recovery is faster for how you feel than for how you perform, and a single lie-in does not undo a week. What the research actually shows, and a realistic schedule for paying it back.',
    h1: 'How Long Does It Take to Recover From Sleep Debt?',
    crumb: 'Sleep debt recovery',
    homeLabel: 'How long sleep debt takes to recover',
    lede: 'The honest answer is two different numbers: your alertness recovers in a night or two, and your performance takes considerably longer. Most advice conflates the two, which is why people think a Sunday lie-in has fixed them.',
    sections: [
      {
        h2: 'What "sleep debt" actually measures',
        body: `<p>Sleep debt is the running total of the gap between the sleep you needed and the sleep you got. Per night it is <code>max(0, target − actual)</code>, summed over the period you are looking at.</p>
      <div class="formula">debt = Σ max(0, target − hours_slept)   over n nights</div>
      <p>Seven nights of 6, 7, 6.5, 5, 7.5, 6, 7 against an 8-hour target gives 2 + 1 + 1.5 + 3 + 0.5 + 2 + 1 = <strong>11 hours</strong> in a week — close to a night and a half.</p>
      <p>That arithmetic is real but it is a model, not a bank balance. Sleep does not repay one-to-one, and the recovery curves for subjective sleepiness and objective performance do not line up.</p>`
      },
      {
        h2: 'Two recovery curves that move at different speeds',
        body: `<p>This is the part that matters and the part most articles skip.</p>
      <p><strong>How you feel</strong> recovers quickly. After one or two nights of full sleep, most people report normal alertness. This is why the weekend strategy feels like it works.</p>
      <p><strong>How you perform</strong> recovers more slowly. Laboratory studies of restricted sleep show attention and reaction-time measures still degraded after a single recovery night, improving across several consecutive nights of adequate sleep rather than one long one.</p>
      <p>The gap between the two is the trap. You feel fixed before you are, and the tasks that suffer most — sustained attention, impulse control, noticing that you made an error — are exactly the ones you cannot self-assess accurately while impaired.</p>`
      },
      {
        h2: 'A realistic timeline',
        body: `<div class="table-scroll">
        <table>
          <thead><tr><th>What happened</th><th>Feels normal again</th><th>Performance back to baseline</th></tr></thead>
          <tbody>
            <tr><td>One short night (4–5 hours)</td><td>Next day</td><td>1–2 nights</td></tr>
            <tr><td>A week of 6-hour nights</td><td>1–2 nights</td><td>Several nights, often a week</td></tr>
            <tr><td>Two weeks of 5–6 hours</td><td>2–3 nights</td><td>One to two weeks of consistent sleep</td></tr>
            <tr><td>Months of restriction</td><td>About a week</td><td>Weeks, and some effects may not fully reverse</td></tr>
          </tbody>
        </table>
      </div>
      <p>These are ranges from group studies, not individual guarantees. Some people recover faster, and people differ in how sensitive they are to restriction in the first place.</p>`
      },
      {
        h2: 'Why the weekend lie-in backfires',
        body: `<p>Sleeping until noon on Sunday does repay some of the arithmetic. It also shifts your circadian phase later, because the body clock anchors to wake time more than to bedtime. The result is a Monday that starts before your body thinks the night is over — the familiar "social jet lag".</p>
      <p>The practical alternative is to <strong>move bedtime earlier rather than wake time later</strong>. Going to bed an hour earlier for five nights repays the same five hours as one five-hour lie-in, without moving your clock, and it distributes the recovery in the way the performance curve actually responds to.</p>
      <p>If you do sleep in, cap it at about an hour past your usual wake time and get bright light soon after. That keeps the phase shift small enough to recover from by Tuesday.</p>`
      },
      {
        h2: 'What actually works',
        body: `<ol>
        <li><strong>Add, do not binge.</strong> One to two extra hours a night for several nights beats one very long night.</li>
        <li><strong>Fix the wake time.</strong> Keep it constant including weekends, within an hour. It is the anchor for everything else.</li>
        <li><strong>Naps of 10–20 minutes.</strong> Long enough to restore alertness, short enough to avoid inertia and without pushing bedtime later.</li>
        <li><strong>Cut caffeine after midday.</strong> Half-life is roughly five to six hours, so a 3pm coffee is still a quarter strength at 9pm.</li>
        <li><strong>Protect the last hour.</strong> The barrier to falling asleep is usually mental rather than physical — email and screens keep the arousal system running.</li>
        <li><strong>Get light in the morning.</strong> Fifteen minutes outdoors within an hour of waking does more for phase than any supplement.</li>
      </ol>`
      },
      {
        h2: 'When it is not sleep debt',
        body: `<p>If you consistently get seven to nine hours and still wake exhausted, the debt model is the wrong tool. Loud snoring, waking with a dry mouth or headache, needing the bathroom repeatedly, falling asleep while driving or during quiet activities — these point to something a calculator cannot see.</p>
      <p>Obstructive sleep apnoea is common, treatable, and routinely missed, particularly in people who do not fit the stereotype. No amount of sleep hygiene compensates for an airway that closes repeatedly through the night. That needs a clinician, not a schedule change.</p>`
      }
    ],
    faq: [
      { q: 'Can I repay sleep debt in one long night?', a: 'Only the arithmetic, and only partially. A long night restores subjective alertness, but performance measures improve across several consecutive adequate nights rather than one. It also delays your body clock, which makes the following morning harder.' },
      { q: 'How much sleep debt is too much?', a: 'There is no clinical threshold, but the practical signal is accumulation: ten hours or more inside a week means your schedule, not your willpower, is the problem. At that level a single early night will not fix it.' },
      { q: 'Do naps count towards repaying sleep debt?', a: 'Partially. A 10–20 minute nap offsets some of a shortfall without causing grogginess. Naps over about 30 minutes risk sleep inertia and can push bedtime later, which shifts the problem rather than solving it.' },
      { q: 'Does catching up on weekends work?', a: 'It restores alertness and partly repays the debt, but the phase shift from late waking makes Monday worse. Moving bedtime earlier on weeknights is more effective for the same hours of recovery.' },
      { q: 'How long until I feel normal again?', a: 'For a few short nights, one or two full nights. For weeks of restriction, expect to feel normal within about a week while performance continues improving for longer. Feeling recovered and being recovered are not the same moment.' },
      { q: 'Is sleep debt permanent?', a: 'Most of it is recoverable with consistent adequate sleep. The concern in the research is chronic restriction over years, where associations with metabolic and cardiovascular outcomes persist. The debt model describes weeks, not decades.' }
    ],
    cta: {
      title: 'Log your last few nights',
      text: 'Enter the hours you actually slept and see the accumulated shortfall plus a recovery schedule.',
      label: 'Open the sleep debt calculator',
      href: '/sleep-debt-calculator/'
    },
    related: [
      { text: 'Sleep debt calculator', href: '/sleep-debt-calculator/' },
      { text: 'Overtime pay calculator', href: '/overtime-pay-calculator/' },
      { text: '40 hours a week is how many hours a year?', href: '/40-hours-a-week-is-how-many-hours-a-year/' },
      { text: 'Savings goal calculator with inflation', href: '/savings-goal-calculator/' }
    ]
  },

  // ---------------------------------------------------------------- 6
  {
    slug: 'savings-goal-with-inflation-explained',
    title: 'Why Your Savings Goal Needs an Inflation Adjustment',
    desc: 'A goal written in today\'s money is a moving target. How to convert it to the nominal amount you actually need, why deflating your return double-counts, and which inflation rate to use for which goal.',
    h1: 'Why Your Savings Goal Needs an Inflation Adjustment',
    crumb: 'Savings and inflation',
    homeLabel: 'Why savings goals need inflation adjustment',
    lede: 'Saving $100,000 for a goal that costs $100,000 today feels like a plan. Ten years from now that money buys about three quarters of it. The gap is not a fee or a mistake — it is the price of the thing you are saving for.',
    sections: [
      {
        h2: 'The two-step calculation',
        body: `<p>Most savings calculators ask for a future amount and treat it as fixed. That is the wrong frame for anything you will actually spend later, because the thing you are buying gets more expensive while you save.</p>
      <h3>Step 1 — inflate the goal to the date you need it</h3>
      <div class="formula">nominal goal = goal today × (1 + inflation)^years</div>
      <p>$100,000 in ten years at 3% becomes $100,000 × 1.03<sup>10</sup> = <strong>$134,392</strong>. The extra $34,392 is the same basket of goods at a higher price.</p>
      <h3>Step 2 — solve for the monthly deposit</h3>
      <p>Existing savings grow at the return rate, and the deposits form an annuity:</p>
      <div class="formula">FV = PV(1 + r)^n + PMT × [((1 + r)^n − 1) ÷ r]</div>
      <p>With $15,000 already saved at 6%, that balance grows to about $26,863 over ten years, leaving $107,529 to fund from deposits — roughly $662 a month.</p>`
      },
      {
        h2: 'The double-counting mistake',
        body: `<p>This is the most common error in DIY retirement and savings maths, and it goes in both directions.</p>
      <p><strong>Option A:</strong> state the goal in today's money, inflate it to the target date, and apply the <em>nominal</em> return to your savings. Correct.</p>
      <p><strong>Option B:</strong> state the goal in today's money, keep it unadjusted, and apply the <em>real</em> return (nominal minus inflation) to your savings. Also correct — it produces the same answer, because the arithmetic is equivalent.</p>
      <p><strong>What fails:</strong> inflating the goal <em>and</em> deflating the return. That counts inflation twice and overstates the deposit you need by a wide margin, which is how people talk themselves out of goals that were affordable.</p>`
      },
      {
        h2: 'Which inflation rate for which goal',
        body: `<div class="table-scroll">
        <table>
          <thead><tr><th>Goal</th><th>Reasonable rate</th><th>Why</th></tr></thead>
          <tbody>
            <tr><td>General savings target</td><td>2.5% – 3.0%</td><td>Roughly the long-run target in developed economies</td></tr>
            <tr><td>House deposit</td><td>3% – 5%</td><td>Housing has run above general inflation in most supply-constrained cities</td></tr>
            <tr><td>Education</td><td>4% – 6%</td><td>Tuition has historically outpaced general prices</td></tr>
            <tr><td>Healthcare</td><td>3% – 5%</td><td>Consistently above general inflation in most systems</td></tr>
            <tr><td>A car in 3 years</td><td>2% – 3%</td><td>Short horizon; depreciation and model changes matter more</td></tr>
          </tbody>
        </table>
      </div>
      <p>Using the general rate for a house deposit is the most common and most expensive shortcut. A 1% difference over fifteen years moves the target by roughly 16%.</p>`
      },
      {
        h2: 'Real return is the number that matters',
        body: `<div class="formula">real return ≈ (1 + nominal) ÷ (1 + inflation) − 1</div>
      <p>A 6% nominal return against 3% inflation is a real return of about 2.91%. That is the rate at which your purchasing power actually grows, and it is the only figure that tells you whether the plan improves your position or merely keeps pace.</p>
      <p>Note what happens when the return is below inflation: the real return is negative, and every deposit is fighting a rising price with a shrinking balance. Cash in a low-rate account during a high-inflation period produces exactly this, which is why "safe" savings can still lose ground.</p>`
      },
      {
        h2: 'The assumptions that quietly break the plan',
        body: `<ul>
        <li><strong>Tax.</strong> Returns are usually quoted pre-tax. Interest is taxed as it is received in most jurisdictions, which cuts the compounding rate.</li>
        <li><strong>Fees.</strong> A 1% annual fee over 20 years removes roughly 18% of the final balance. It is the single most controllable drag.</li>
        <li><strong>Constant returns.</strong> A fixed average cannot show a bad year arriving just before you need the money. That is why the final two years of any goal should be de-risked.</li>
        <li><strong>Perfect deposits.</strong> A plan assuming 120 deposits out of 120 is fragile. Target a figure you can meet in a bad month.</li>
      </ul>
      <p>A useful robustness test: re-run with the return cut by two percentage points. If the monthly amount is still affordable, the plan survives a bad decade. If it is not, the goal needs a longer horizon, a smaller scope, or a larger income — no assumption will fix that.</p>`
      },
      {
        h2: 'Order of operations',
        body: `<p>Inflation adjustment is the arithmetic; where the money sits is the strategy, and the order matters more than the rate.</p>
      <ol>
        <li><strong>Emergency fund first.</strong> Three to six months of essential spending in cash, before anything involving risk.</li>
        <li><strong>Take the employer match.</strong> An employer contribution is an immediate, risk-free return no market assumption beats.</li>
        <li><strong>Clear high-interest debt.</strong> Paying off a 20% card is a guaranteed 20% return.</li>
        <li><strong>Then fund the goal.</strong> With the above handled, the monthly deposit is realistic rather than aspirational.</li>
      </ol>`
      }
    ],
    faq: [
      { q: 'Why does my goal need to be higher than the price today?', a: 'Because the price rises while you save. At 3% a year, $100,000 today is about $134,400 in ten years and about $180,600 in twenty. Saving the current price leaves you short by exactly the inflation component.' },
      { q: 'Should I subtract inflation from my investment return?', a: 'Do it once, not twice. Either inflate the goal and use the nominal return, or keep the goal in today\'s money and use the real return. Doing both double-counts and overstates the deposit required.' },
      { q: 'What inflation rate should I use?', a: '2.5–3% for general goals in developed economies, higher for housing, education, and healthcare which have run above general inflation. Re-run the projection when conditions change rather than trusting one long-run average.' },
      { q: 'Does the calculator account for tax?', a: 'No, returns are pre-tax. Reduce the rate by your marginal tax on the interest portion for a conservative plan, or use a tax-advantaged account and ignore the adjustment.' },
      { q: 'What if inflation is higher than my return?', a: 'Then your real return is negative and the balance is losing purchasing power while it grows in nominal terms. In that case a cash-like account is not a savings strategy — it is a slower loss, and the plan needs a different vehicle or a longer horizon.' },
      { q: 'How often should I re-run the numbers?', a: 'Once a year, and whenever inflation or your income changes materially. A projection that is never revisited is a guess that has been left alone for too long.' }
    ],
    cta: {
      title: 'Adjust your goal',
      text: 'Enter a target in today\'s money and see the nominal figure you need plus the monthly deposit.',
      label: 'Open the savings goal calculator',
      href: '/savings-goal-calculator/'
    },
    related: [
      { text: 'Savings goal calculator with inflation', href: '/savings-goal-calculator/' },
      { text: 'Freelance rate calculator', href: '/freelance-rate-calculator/' },
      { text: 'Hourly vs salary: which pays more?', href: '/hourly-vs-salary-which-pays-more/' },
      { text: '$35 an hour is how much a year?', href: '/35-an-hour-is-how-much-a-year/' }
    ]
  },

  // ---------------------------------------------------------------- 7
  {
    slug: '40-hours-a-week-is-how-many-hours-a-year',
    title: '40 Hours a Week Is How Many Hours a Year?',
    desc: '2,080 is the standard answer, and it is wrong for almost everyone. Where the number comes from, the variants that matter for pay and loans, and how unpaid leave and overtime change it.',
    h1: '40 Hours a Week Is How Many Hours a Year?',
    crumb: '40 hours a week in a year',
    homeLabel: '40 hours a week in hours per year',
    lede: 'The short answer is 2,080 — forty hours across fifty-two weeks. The useful answer depends on how many weeks you are actually paid for, which is where most conversions quietly go wrong.',
    sections: [
      {
        h2: 'Where 2,080 comes from',
        body: `<div class="formula">40 hours × 52 weeks = 2,080 hours</div>
      <p>That is the number payroll systems, mortgage lenders, and salary-to-hourly converters use. It assumes you are paid for all 52 weeks of the year including public holidays and paid vacation.</p>
      <p>It is a convention, not a description of your life. Anyone who takes unpaid leave, works seasonally, or contracts without billing during holidays works fewer hours, and dividing a salary by 2,080 in those cases produces a rate that is too low.</p>`
      },
      {
        h2: 'The variants that actually apply',
        body: `<div class="table-scroll">
        <table>
          <thead><tr><th>Schedule</th><th class="num">Hours per year</th><th>Typical situation</th></tr></thead>
          <tbody>
            <tr><td>40 hrs × 52 weeks</td><td class="num">2,080</td><td>Standard payroll baseline</td></tr>
            <tr><td>40 hrs × 50 weeks</td><td class="num">2,000</td><td>Two weeks unpaid, or 10 days PTO taken</td></tr>
            <tr><td>40 hrs × 48 weeks</td><td class="num">1,920</td><td>Four weeks off, common in Europe</td></tr>
            <tr><td>37.5 hrs × 48 weeks</td><td class="num">1,800</td><td>UK full-time with 25 days leave</td></tr>
            <tr><td>35 hrs × 52 weeks</td><td class="num">1,820</td><td>Short full-time week</td></tr>
            <tr><td>25 hrs × 52 weeks</td><td class="num">1,300</td><td>Part-time</td></tr>
            <tr><td>45 hrs × 50 weeks</td><td class="num">2,250</td><td>Salaried with regular unpaid overtime</td></tr>
          </tbody>
        </table>
      </div>
      <p>The 2,000-hour figure is a useful middle assumption for anyone who takes two unpaid weeks. It changes a $60,000 salary from $28.85 an hour to $30.00 — a 4% difference that matters when comparing offers.</p>`
      },
      {
        h2: 'Paid leave is not fewer hours worked',
        body: `<p>This distinction trips people up constantly. If you are paid for 52 weeks and take 15 days of paid holiday, you are <em>paid</em> for 2,080 hours. The hours you actually <em>work</em> are lower.</p>
      <p>Both numbers are legitimate, for different questions:</p>
      <ul>
        <li><strong>Converting a salary to an hourly rate for comparison:</strong> use hours actually worked, because you are asking what your time is worth.</li>
        <li><strong>Checking a payslip:</strong> use paid hours, because that is what the payroll system divides by.</li>
        <li><strong>Calculating overtime:</strong> use hours worked in the workweek, which is a separate measure entirely.</li>
      </ul>
      <p>A salaried employee on $60,000 with 15 days of paid leave works roughly 1,960 hours while being paid for 2,080. Their effective rate per hour worked is $30.61, not $28.85.</p>`
      },
      {
        h2: 'Overtime makes the annual hours number irrelevant',
        body: `<p>None of the figures above include overtime. A 45-hour week for 48 weeks is 2,160 hours worked, and the pay calculation splits it differently: 40 hours at straight time plus 5 at 1.5× for each of those weeks.</p>
      <div class="formula">annual pay = (40 × rate × weeks) + (5 × rate × 1.5 × weeks)</div>
      <p>At $20 an hour over 48 weeks that is $38,400 + $7,200 = $45,600. Dividing that by 2,160 hours gives $21.11 — the effective hourly rate, which is higher than the nominal $20.00 because five hours a week earn a premium.</p>
      <p>This is why "hours per year" is the wrong denominator for anyone with regular overtime. The right one is total hours actually worked, and the right numerator is total pay.</p>`
      },
      {
        h2: 'Why lenders still use 2,080',
        body: `<p>Mortgage applications and income verification use 2,080 because it is standardised across applicants and produces a comparable number regardless of an individual's leave arrangements. It is a classification convention, not an attempt to describe your hours.</p>
      <p>The consequence is that hourly workers with steady overtime sometimes have their income understated for lending purposes, because lenders may discount overtime that is not contractually guaranteed. If you are applying for a mortgage on overtime income, keeping two years of payslips that show the pattern is what makes it countable.</p>`
      },
      {
        h2: 'The calculation in one line',
        body: `<div class="formula">annual hours = hours per week × weeks actually paid</div>
      <p>Everything else — whether the weeks are 52, 50, or 48, whether leave is paid or unpaid, whether overtime is involved — is a question about which of those two inputs you should use. Get those right and the multiplier is trivial.</p>`
      }
    ],
    faq: [
      { q: 'Is 2,080 hours a year correct?', a: 'It is correct for someone paid for 40 hours across all 52 weeks. It is wrong for anyone with unpaid leave, seasonal work, or a part-time schedule. Divide by the weeks you are actually paid for.' },
      { q: 'How many hours a year is 40 hours a week for 50 weeks?', a: '2,000 hours. That is the right figure if you take two weeks unpaid, and it raises the implied hourly rate of a fixed salary by about 4% compared with dividing by 2,080.' },
      { q: 'How many working hours are in a year excluding holidays?', a: 'In the US, roughly 2,080 minus 8 hours for each holiday not worked, if the holiday is unpaid. With 10 unpaid holidays that is 2,000 hours. With paid holidays you are still paid for 2,080.' },
      { q: 'Does 2,080 include paid time off?', a: 'Yes, if the leave is paid. Paid leave means you receive money for those hours but do not work them. For an effective hourly rate based on time actually spent working, subtract the leave hours.' },
      { q: 'What is the annual hours figure for part-time work?', a: 'Multiply weekly hours by paid weeks. Twenty-five hours a week for 52 weeks is 1,300 hours; the same schedule for 48 weeks is 1,200.' }
    ],
    cta: {
      title: 'Convert your own schedule',
      text: 'Set hours per day, days per week, and unpaid weeks to get the annual figure and every pay period.',
      label: 'Open the hourly to salary calculator',
      href: '/hourly-to-salary-calculator/'
    },
    related: [
      { text: 'Hourly to salary calculator', href: '/hourly-to-salary-calculator/' },
      { text: 'Overtime pay calculator', href: '/overtime-pay-calculator/' },
      { text: 'Hourly vs salary: which pays more?', href: '/hourly-vs-salary-which-pays-more/' },
      { text: '$30 an hour is how much a year?', href: '/30-an-hour-is-how-much-a-year/' }
    ]
  },

  // ---------------------------------------------------------------- 8
  {
    slug: 'is-30-an-hour-good-money',
    title: 'Is $30 an Hour Good Money?',
    desc: '$30 an hour is $62,400 a year at full time — above the US median for hourly workers, tight in expensive cities, comfortable in most of the country. How to judge it against your own costs rather than a national average.',
    h1: 'Is $30 an Hour Good Money?',
    crumb: '$30 an hour',
    homeLabel: 'Is $30 an hour good money',
    lede: '$30 an hour is $62,400 a year before tax. Whether that is good depends on three things the rate itself cannot tell you: where you live, how many people it supports, and what your fixed costs already are.',
    sections: [
      {
        h2: 'The number, and where it sits',
        body: `<div class="formula">$30.00 × 40 hours × 52 weeks = $62,400</div>
      <p>Median full-time hourly earnings in the United States sit near $30, which makes this rate roughly the middle of the distribution — half of full-time hourly workers earn more, half earn less. It is clearly above the federal minimum wage of $7.25 and above most state minimums.</p>
      <p>Compared with salaried work, $62,400 is a respectable single income. Compared with the cost of housing in a major coastal city, it is a budget that requires decisions. Both statements are true at once, which is why national averages are a poor guide to a personal decision.</p>`
      },
      {
        h2: 'The 30% housing test',
        body: `<p>A long-standing rule of thumb: rent should not exceed 30% of gross income. At $62,400 that is $1,560 a month.</p>
      <div class="table-scroll">
        <table>
          <thead><tr><th>Housing cost</th><th>Share of gross</th><th>What it means</th></tr></thead>
          <tbody>
            <tr><td>$1,200/mo</td><td>23%</td><td>Comfortable, room to save</td></tr>
            <tr><td>$1,560/mo</td><td>30%</td><td>At the guideline</td></tr>
            <tr><td>$1,900/mo</td><td>37%</td><td>Tight, little margin for an emergency</td></tr>
            <tr><td>$2,400/mo</td><td>46%</td><td>Structurally stressed on this income</td></tr>
          </tbody>
        </table>
      </div>
      <p>In a city where a one-bedroom runs $2,400, $30 an hour is not a housing-secure income for a single earner. In a mid-size market where the same apartment is $1,100, it is comfortable with room to save. The rate did not change; the city did.</p>`
      },
      {
        h2: 'One income or two people',
        body: `<p>The same $62,400 supports very different lives depending on who it covers.</p>
      <ul>
        <li><strong>Single adult, low fixed costs:</strong> workable almost anywhere, with room for savings and a modest emergency fund.</li>
        <li><strong>Single adult, car payment and student loans:</strong> workable in most of the country, thin in expensive metros.</li>
        <li><strong>Couple with one earner:</strong> tight in mid-cost cities, difficult in high-cost ones.</li>
        <li><strong>Family with children:</strong> generally not enough on one income once childcare is counted — full-time childcare commonly runs $800–$2,000 a month per child.</li>
      </ul>
      <p>Childcare is the cost that changes the answer most abruptly, because it is large, non-negotiable, and arrives suddenly. A budget that works at $30 an hour without children can fail at the same rate with one.</p>`
      },
      {
        h2: 'What the rate leaves out',
        body: `<p>Four costs that never appear in an hourly-to-salary comparison but change the disposable income substantially:</p>
      <ol>
        <li><strong>Health insurance.</strong> If the employer does not cover it, a single adult plan can run $300–$700 a month. That is $2–$4 an hour of the rate.</li>
        <li><strong>Commute.</strong> A job that requires a car adds fuel, insurance, maintenance, and depreciation — commonly $400–$800 a month in the US.</li>
        <li><strong>Unpaid time off.</strong> If the role has no paid leave, two weeks off is $2,400 of income that does not arrive.</li>
        <li><strong>Schedule volatility.</strong> A nominal $30 with hours that swing between 25 and 45 is not the same as a guaranteed 40. Annualise the realistic average, not the best week.</li>
      </ol>
      <p>Two jobs at the same $30 an hour can differ by $8,000–$10,000 a year in real terms once these are counted. The rate is the least informative part of the offer.</p>`
      },
      {
        h2: 'How to judge it for yourself',
        body: `<p>Ignore the national median and run three personal numbers instead:</p>
      <ol>
        <li><strong>Annual gross:</strong> realistic hours × rate × 52. Not the best week, the average week.</li>
        <li><strong>Net after deductions:</strong> subtract 7.65% for Social Security and Medicare, then estimate federal and state income tax, then subtract any benefits you pay for.</li>
        <li><strong>Fixed costs:</strong> rent or mortgage, utilities, transport, insurance, debt minimums, childcare. Subtract from net.</li>
      </ol>
      <p>What remains is the only figure that answers the question. If it is positive and covers a 10% savings rate, $30 is a good rate for your situation. If it is negative, the rate is not the problem to solve first — the fixed costs or the household structure are.</p>`
      },
      {
        h2: 'Where $30 an hour goes next',
        body: `<p>If the role is non-exempt, overtime is the fastest lever: five extra hours a week at 1.5× adds about $11,700 a year, which is worth more than a $3 an hour raise at 40 hours.</p>
      <p>If it is exempt, the lever is the hours themselves. A salaried role paying the equivalent of $30 at 40 hours becomes $26 an hour at 46 hours, and that erosion is usually invisible because the paycheque does not change.</p>`
      }
    ],
    faq: [
      { q: 'Is $30 an hour a good wage?', a: 'It is around the median for full-time hourly workers in the US and clearly above minimum wage. Whether it is good depends on housing costs where you live and how many people it supports — $62,400 is comfortable for a single earner in most of the country and tight in major coastal cities.' },
      { q: 'How much is $30 an hour per month?', a: '$5,200 gross before tax, which is $62,400 divided by 12. After Social Security and Medicare at 7.65% that is about $4,802, before income tax and any benefit deductions.' },
      { q: 'Is $30 an hour enough to live on?', a: 'For a single adult outside the most expensive metros, generally yes. For a family on one income, usually not once childcare and health insurance are counted. The rate is only half the calculation; household size and fixed costs are the other half.' },
      { q: 'What is $30 an hour annually with overtime?', a: 'Five hours of overtime a week at 1.5× adds $225 weekly, taking the annual figure from $62,400 to about $74,100. Ten hours a week takes it to roughly $85,800, assuming the overtime is paid as federal law requires.' },
      { q: 'How does $30 an hour compare to a $60,000 salary?', a: 'They are close on paper — $62,400 against $60,000 — but the hourly role usually pays overtime and the salaried one usually does not. At 45 hours a week the salary is worth about $26.67 an hour; the hourly rate with five hours of overtime is worth about $31.73.' }
    ],
    cta: {
      title: 'Check the annual figure',
      text: 'Change the hours, add unpaid weeks, or see what overtime at this rate is worth.',
      label: 'Open the overtime calculator',
      href: '/overtime-pay-calculator/'
    },
    related: [
      { text: '$30 an hour is how much a year?', href: '/30-an-hour-is-how-much-a-year/' },
      { text: 'Hourly to salary calculator', href: '/hourly-to-salary-calculator/' },
      { text: 'Overtime pay calculator', href: '/overtime-pay-calculator/' },
      { text: 'Hourly vs salary: which pays more?', href: '/hourly-vs-salary-which-pays-more/' }
    ]
  }

];

module.exports = guides;
