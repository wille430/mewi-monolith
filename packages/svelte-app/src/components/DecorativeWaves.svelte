<div class="wrapper">
	<svg class="svg" viewBox="0 0 100 100" height="100%" width="100%" preserveAspectRatio="none">
		<path
			fill="url(#grad1)"
			id="p1"
			vector-effect="non-scaling-stroke"
			d="M0 55 Q25 100, 53 55 Q80 10, 100 35 V0 H0"
		/>
		<defs>
			<linearGradient id="grad1" gradientTransform="rotate(90)" x1="0%" y1="0%" x2="100%" y2="0%">
				<stop offset="0%" id="s1" />
				<stop offset="50%" id="s2" />
				<stop offset="100%" id="s3" />
			</linearGradient>
		</defs>
	</svg>
	<svg class="svg" viewBox="0 0 100 100" height="100%" width="100%" preserveAspectRatio="none">
		<path
			id="p2"
			vector-effect="non-scaling-stroke"
			d="M0 55 Q25 100, 50 35 Q65 0, 80 22 Q90 35, 100 35 V0 H0"
		/>
	</svg>
</div>

<style lang="scss">
	.wrapper {
		position: relative;
		height: calc((15vw + 20vh) / 2);
		width: 100%;
		top: 0;
		left: 0;
	}

	stop {
		stop-opacity: 1;
	}
	stop#s1 {
		stop-color: '#4158D0';
	}
	stop#s2 {
		stop-color: '#C850C0';
	}
	stop#s3 {
		stop-color: '#FFCC70';
	}

	.svg {
		position: absolute;
	}

	#p1 {
		fill: $secondary;
	}
	#p2 {
		fill: $primary;
	}
</style>
