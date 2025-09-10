const Form = ({ children, onSubmit, className }) => {
  const onFormSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <form className={className} onSubmit={onFormSubmit}>
      {children}
    </form>
  );
};

export default Form;
