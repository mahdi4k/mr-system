const usePcparts = () => {
    const pcParts = [
        { name: 'cpu', link: '/category/cpu', title: 'cpu', svg: '/svg/cpu.svg' },
        { name: 'motherboard', link: '/category/motherboard', title: 'مادربرد', svg: '/svg/motherboard.svg' },
        { name: 'graphic', link: '/category/graphic', title: 'کارت گرافیک', svg: '/svg/graphic.svg' },
        { name: 'power', link: '/category/power', title: 'پاور' , svg: '/svg/power.svg' },
        { name: 'ram', link: '/category/ram', title: 'رم', svg: '/svg/ram.svg' },
        { name: 'fan', link: '/category/fan', title: 'فن', svg: '/svg/fan.svg' },
        { name: 'ssd', link: '/category/ssd', title: 'ssd', svg: '/svg/ssd.svg' },
        { name: 'case', link: '/category/case', title: 'کیس', svg: '/svg/case.svg' },
    ];

    return pcParts;
};

export default usePcparts;