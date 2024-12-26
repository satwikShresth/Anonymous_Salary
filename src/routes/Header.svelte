<script>
	import { page } from '$app/stores';
	import github from '$lib/images/github.svg';
</script>

<header>
	<nav>
		<ul>
			<li aria-current={$page.url.pathname === '/table' ? 'page' : undefined}>
				<a href="/table">Table</a>
			</li>
			<li aria-current={$page.url.pathname === '/form' ? 'page' : undefined}>
				<a href="/form">Form</a>
			</li>
		</ul>
	</nav>
</header>

<style>
	header {
		display: flex;
		justify-content: center;
	}

	nav {
		display: flex;
		justify-content: space-between;
	}

	ul {
		position: relative;
		padding: 0;
		margin: 0;
		height: 3em;
		display: flex;
		justify-content: center;
		align-items: center;
		list-style: none;
		background: var(--background);
		background-size: contain;
	}

	li {
		position: relative;
		height: 100%;
	}

	li[aria-current='page']::before {
		--size: 12px;
		content: '';
		width: 0;
		height: 0;
		position: absolute;
		top: 0;
		left: calc(50% - var(--size));
		border: var(--size) solid transparent;
		border-top: var(--size) solid var(--color-theme-1);
	}

	nav a {
		display: flex;
		height: 100%;
		align-items: center;
		padding: 0 2rem;
		color: var(--color-text);
		font-weight: 900;
		font-size: 1.5rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		text-decoration: none;
		margin-top: 0.4em;
		transition: color 0.2s linear;
	}

	a:hover {
		color: var(--color-theme-1);
	}
</style>
