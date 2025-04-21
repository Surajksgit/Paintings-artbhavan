function selectPayment(method) {
    document.getElementById('payment_method').value = method;

    document.getElementById('cardDetails').style.display = method === 'card' ? 'block' : 'none';
    document.getElementById('upiDetails').style.display = method === 'upi' ? 'block' : 'none';

    document.querySelectorAll('.payment-option').forEach(opt => opt.classList.remove('border-primary'));
    const selected = document.querySelector(`.payment-option[onclick*="${method}"]`);
    if (selected) selected.classList.add('border', 'border-primary');
}