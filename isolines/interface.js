export const renderErrorToast = () => {
  const errorToast = document.getElementById('error-toast');
  errorToast.style.transform = `translateY(0)`;

  setTimeout(() => {
    errorToast.style.transform = `translateY(100%)`;
  }, 3500);
};
