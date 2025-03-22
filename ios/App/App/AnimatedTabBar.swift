import UIKit
import SwiftUI

class AnimatedTabBar: UIView {
    // MARK: - Properties
    private var items: [TabBarItem] = []
    private var selectedIndex: Int = 0
    private var onItemSelected: ((Int) -> Void)?
    
    private lazy var stackView: UIStackView = {
        let stack = UIStackView()
        stack.axis = .horizontal
        stack.distribution = .fillEqually
        stack.alignment = .center
        stack.backgroundColor = DesignSystem.Colors.background
        stack.layer.cornerRadius = DesignSystem.Layout.cornerRadius
        stack.addShadow()
        return stack
    }()
    
    private lazy var indicatorView: UIView = {
        let view = UIView()
        view.backgroundColor = DesignSystem.Colors.primary.withAlphaComponent(0.2)
        view.layer.cornerRadius = DesignSystem.Layout.cornerRadius / 2
        return view
    }()
    
    // MARK: - Initialization
    override init(frame: CGRect) {
        super.init(frame: frame)
        setupViews()
    }
    
    required init?(coder: NSCoder) {
        super.init(coder: coder)
        setupViews()
    }
    
    // MARK: - Setup
    private func setupViews() {
        addSubview(stackView)
        stackView.addSubview(indicatorView)
        
        setupConstraints()
    }
    
    private func setupConstraints() {
        stackView.translatesAutoresizingMaskIntoConstraints = false
        indicatorView.translatesAutoresizingMaskIntoConstraints = false
        
        NSLayoutConstraint.activate([
            stackView.topAnchor.constraint(equalTo: topAnchor, constant: 8),
            stackView.leadingAnchor.constraint(equalTo: leadingAnchor, constant: 16),
            stackView.trailingAnchor.constraint(equalTo: trailingAnchor, constant: -16),
            stackView.bottomAnchor.constraint(equalTo: bottomAnchor, constant: -8)
        ])
    }
    
    // MARK: - Public Methods
    func configure(with items: [TabBarItem], selectedIndex: Int = 0, onItemSelected: @escaping (Int) -> Void) {
        self.items = items
        self.selectedIndex = selectedIndex
        self.onItemSelected = onItemSelected
        
        setupItems()
        updateIndicator(animated: false)
    }
    
    private func setupItems() {
        stackView.arrangedSubviews.forEach { $0.removeFromSuperview() }
        
        for (index, item) in items.enumerated() {
            let button = createTabBarButton(item: item, index: index)
            stackView.addArrangedSubview(button)
        }
    }
    
    private func createTabBarButton(item: TabBarItem, index: Int) -> UIButton {
        let button = UIButton(type: .system)
        button.setImage(item.icon, for: .normal)
        button.tintColor = index == selectedIndex ? DesignSystem.Colors.primary : DesignSystem.Colors.text
        button.tag = index
        button.addTarget(self, action: #selector(tabBarButtonTapped(_:)), for: .touchUpInside)
        return button
    }
    
    @objc private func tabBarButtonTapped(_ sender: UIButton) {
        selectItem(at: sender.tag)
    }
    
    private func selectItem(at index: Int) {
        guard index != selectedIndex else { return }
        
        selectedIndex = index
        updateIndicator()
        updateButtonColors()
        onItemSelected?(index)
    }
    
    private func updateIndicator(animated: Bool = true) {
        guard let selectedButton = stackView.arrangedSubviews[selectedIndex] as? UIButton else { return }
        
        let duration = animated ? DesignSystem.Animations.standardDuration : 0
        
        UIView.animate(
            withDuration: duration,
            delay: 0,
            usingSpringWithDamping: DesignSystem.Animations.springDamping,
            initialSpringVelocity: DesignSystem.Animations.initialSpringVelocity,
            options: .curveEaseInOut,
            animations: {
                self.indicatorView.frame = selectedButton.frame.insetBy(dx: 8, dy: 8)
            }
        )
    }
    
    private func updateButtonColors() {
        for (index, view) in stackView.arrangedSubviews.enumerated() {
            guard let button = view as? UIButton else { continue }
            
            UIView.animate(withDuration: DesignSystem.Animations.quickDuration) {
                button.tintColor = index == self.selectedIndex ? DesignSystem.Colors.primary : DesignSystem.Colors.text
            }
        }
    }
}

// MARK: - TabBarItem
struct TabBarItem {
    let icon: UIImage
    let title: String
}

// MARK: - SwiftUI Preview
struct AnimatedTabBar_Preview: PreviewProvider {
    static var previews: some View {
        VStack {
            Spacer()
            AnimatedTabBarRepresentable(
                items: [
                    TabBarItem(icon: UIImage(systemName: "house.fill")!, title: "Home"),
                    TabBarItem(icon: UIImage(systemName: "person.fill")!, title: "Profile"),
                    TabBarItem(icon: UIImage(systemName: "gear")!, title: "Settings")
                ],
                selectedIndex: 0
            )
            .frame(height: 60)
        }
        .edgesIgnoringSafeArea(.bottom)
    }
}

struct AnimatedTabBarRepresentable: UIViewRepresentable {
    let items: [TabBarItem]
    let selectedIndex: Int
    
    func makeUIView(context: Context) -> AnimatedTabBar {
        let tabBar = AnimatedTabBar()
        tabBar.configure(with: items, selectedIndex: selectedIndex) { _ in }
        return tabBar
    }
    
    func updateUIView(_ uiView: AnimatedTabBar, context: Context) {}
}
