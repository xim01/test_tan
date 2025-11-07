export default function Test() {
  return (
    <details id="test-data" open>
      <summary style={{ marginTop: "0.5rem", padding: "0 1rem ", cursor: "pointer" }}>
        <b>🔍 Тестовые данные (альфа-версия)</b>
      </summary>

      <div style={{ marginTop: "0.5rem" }}>
        <p>
          <b>Альфа-версия — впереди ещё будут доработки!</b>
        </p>
        <p>
          Ссылка на GitHub:&nbsp;
          <a href="https://github.com/xim01/test_tan" target="_blank" rel="noopener noreferrer">
            https://github.com/xim01/test_tan
          </a>
        </p>

        <hr />

        <p>
          <b>Нормальный сценарий входа</b>
        </p>
        <p>
          - Email: <code>user@example.com</code>
        </p>

        <p>
          <b>Без 2FA (обычная аутентификация)</b>
        </p>
        <p>
          - Email: <code>no2fa@example.com</code>
        </p>

        <p>
          <b>Аккаунт заблокирован</b>
        </p>
        <p>
          - Email: <code>locked@account.com</code>
        </p>

        <p>
          <b>Email не подтверждён</b>
        </p>
        <p>
          - Email: <code>unverified@email.com</code>
        </p>

        <br />
        <p>
          - Пароль: <code>123456</code>
        </p>
        <p>
          - Код 2FA: <code>123456</code>
        </p>
      </div>
    </details>
  );
}
