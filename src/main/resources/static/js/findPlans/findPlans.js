
export function initSearchPlans() {
  generateSearchPlans();
}

async function generateSearchPlans() {
  const collapseBody = document.querySelector('#collapseBody');

  const latestPlanResponse = await fetch('/api/public/latest-plans', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  const latestPlans = await latestPlanResponse.json();

  let planHtml = '';

  latestPlans.forEach(plan => {
    const planCardHtml = `
  <li class="latest-plan-item">
    <span>${plan.title}</span>
  </li>
  `;
    planHtml += planCardHtml;
  });

  if (collapseBody) {
    collapseBody.innerHTML = planHtml;
  }
}